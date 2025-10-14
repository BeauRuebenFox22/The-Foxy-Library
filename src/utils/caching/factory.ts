/*
  Generic caching factory for component data (and optionally pre-rendered markup).
  Focus: Avoid repeated Storefront API calls across page loads & multiple instances.

  Strategy:
  - Cache normalized data (preferred) so Stencil still renders & binds events.
  - Optional markup caching (only for fully static / idempotent HTML) via setMarkup/getMarkup helpers.
  - Deterministic key: namespace + stable-hash(params + version + type).
  - Supports localStorage / sessionStorage / memory fallback.
  - TTL + optional staleWhileRevalidate.
  - Inflight request dedupe (single network fetch per key at a time).
  - Event emission (CustomEvent 'iv-cache') for diagnostics (hit/miss/stale/set/purge/error).

  IMPORTANT NOTE ABOUT MARKUP CACHING:
  Injecting raw cached markup can skip Stencil lifecycle & event listener binding.
  Prefer data caching and regular render path. Use markup caching only for static read-only fragments.
*/

export interface CacheStored<T=any> {
  v: string;      // version
  ts: number;     // timestamp (ms)
  ttl: number;    // time-to-live (ms)
  t: 'data' | 'markup'; // entry type
  data: T;        // payload (string for markup)
  meta?: Record<string, any>;
}

export interface CacheGetResult<T=any> {
  data?: T;
  meta?: Record<string, any>;
  isExpired: boolean;
  isStale: boolean;
  ageMs: number;
  raw?: CacheStored<T>;
}

export interface CacheEventDetail {
  action: 'hit' | 'miss' | 'stale' | 'set' | 'purge' | 'error' | 'evict';
  key: string;
  namespace: string;
  info?: any;
}

interface StorageAdapter {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
  keys(): string[]; // restricted to ones we can iterate
}

interface CreateCacheOptions {
  namespace: string;                 // e.g. 'iv-dynamic-products'
  version?: string;                  // bump to invalidate all
  storage?: 'local' | 'session' | 'memory';
  prefix?: string;                   // key prefix
  defaultTTL?: number;               // ms (fresh window)
  staleTTL?: number;                 // optional extra stale window (stale-while-revalidate)
  maxEntries?: number;               // soft cap
  maxValueBytes?: number;            // guard large payloads
  serialize?: (v: any) => string;
  deserialize?: (s: string) => any;
  dispatchEvents?: boolean;          // emit CustomEvents
  target?: HTMLElement | Window;     // event target
}

interface GetOrSetOptions<T=any> {
  ttl?: number;
  meta?: Record<string, any>;
  staleWhileRevalidate?: boolean;
  type?: 'data' | 'markup';
  transform?: (fresh: any) => T; // allow post-processing before store
}

export function createCache(options: CreateCacheOptions) {
  const {
    namespace,
    version = '1',
    storage = 'local',
    prefix = 'iv:cache:',
    defaultTTL = 1000 * 60 * 5,
    staleTTL,
    maxEntries = 200,
    maxValueBytes = 250_000, // ~250 KB safety guard
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    dispatchEvents = true,
    target = (typeof window !== 'undefined' ? window : undefined)
  } = options;

  const adapter = resolveAdapter(storage);
  const inflight = new Map<string, Promise<any>>();
  let opCount = 0;

  function emit(action: CacheEventDetail['action'], key: string, info?: any) {
    if(!dispatchEvents || !target || typeof (target as any).dispatchEvent !== 'function') return;
    try {
      const detail: CacheEventDetail = { action, key, namespace, info };
      target.dispatchEvent(new CustomEvent('iv-cache', { detail, bubbles: true, composed: true }));
    } catch(_) {}
  }

  function stableString(obj: any): string {
    if(obj === null) return 'null';
    const type = typeof obj;
    if(type !== 'object') return JSON.stringify(obj);
    if(Array.isArray(obj)) return '[' + obj.map(stableString).join(',') + ']';
    const keys = Object.keys(obj).sort();
    return '{' + keys.map(k => JSON.stringify(k)+':'+stableString(obj[k])).join(',') + '}';
  }

  function hash(str: string): string {
    let h = 5381, i = str.length;
    while(i) h = (h * 33) ^ str.charCodeAt(--i);
    return (h >>> 0).toString(36);
  }

  function buildKey(type: 'data' | 'markup', params: Record<string, any>): string {
    const base = stableString(params);
    return `${prefix}${namespace}:${type}:${version}:${hash(base)}`;
  }

  function read<T>(key: string): CacheGetResult<T> {
    try {
      const rawStr = adapter.getItem(key);
      if(!rawStr) return { isExpired: true, isStale: false, ageMs: 0 };
      const stored: CacheStored<T> = deserialize(rawStr);
      if(!stored || stored.v !== version) return { isExpired: true, isStale: false, ageMs: 0 };
      const ageMs = Date.now() - stored.ts;
      const isExpired = ageMs > stored.ttl;
      const isStale = isExpired && staleTTL ? ageMs <= stored.ttl + staleTTL : false;
      return { data: stored.data, meta: stored.meta, isExpired, isStale, ageMs, raw: stored };
    } catch(err) {
      emit('error', key, { err: (err as any)?.message });
      return { isExpired: true, isStale: false, ageMs: 0 };
    }
  }

  function write<T>(key: string, type: 'data' | 'markup', data: T, cfg?: { ttl?: number; meta?: Record<string, any> }) {
    const ttl = cfg?.ttl ?? defaultTTL;
    const stored: CacheStored<T> = { v: version, ts: Date.now(), ttl, t: type, data, meta: cfg?.meta };
    try {
      const payload = serialize(stored);
      if(maxValueBytes && byteLength(payload) > maxValueBytes) {
        emit('error', key, { reason: 'oversize', bytes: byteLength(payload) });
        return;
      }
      adapter.setItem(key, payload);
      emit('set', key, { ttl, type });
      enforceLimit();
    } catch(err) {
      emit('error', key, { err: (err as any)?.message });
    }
  }

  function get<T>(key: string): CacheGetResult<T> {
    const res = read<T>(key);
    if(res.data && !res.isExpired) emit('hit', key, { ageMs: res.ageMs });
    else if(res.data && res.isExpired && res.isStale) emit('stale', key, { ageMs: res.ageMs });
    else emit('miss', key);
    return res;
  }

  async function getOrSet<T>(key: string, type: 'data' | 'markup', fetcher: () => Promise<T>, opts?: GetOrSetOptions<T>): Promise<T> {
    const existing = get<T>(key);
    if(existing.data && !existing.isExpired) return existing.data;
    if(existing.data && existing.isStale && opts?.staleWhileRevalidate) {
      // return stale, refresh in background
      refresh(key, type, fetcher, opts);
      return existing.data;
    }
    if(inflight.has(key)) return inflight.get(key)!;
    const p = (async () => {
      try {
        const raw = await fetcher();
        const transformed = opts?.transform ? opts.transform(raw) : raw;
        write(key, type, transformed, { ttl: opts?.ttl, meta: opts?.meta });
        return transformed;
      } finally {
        inflight.delete(key);
      }
    })();
    inflight.set(key, p);
    return p;
  }

  function refresh<T>(key: string, type: 'data' | 'markup', fetcher: () => Promise<T>, opts?: GetOrSetOptions<T>) {
    return getOrSet(key, type, fetcher, opts); // reuse logic
  }

  function purge(key: string) {
    adapter.removeItem(key);
    emit('purge', key);
  }

  function purgePattern(pattern: RegExp | ((k: string) => boolean)) {
    const keys = adapter.keys();
    for(const k of keys) {
      if(!k.startsWith(`${prefix}${namespace}:`)) continue;
      const matched = typeof pattern === 'function' ? pattern(k) : pattern.test(k);
      if(matched) purge(k);
    }
  }

  function clearNamespace() { purgePattern(() => true); }

  function enforceLimit() {
    if(!adapter.keys) return;
    opCount++;
    // only enforce every 20 writes to reduce overhead
    if(opCount % 20 !== 0) return;
    const keys = adapter.keys().filter(k => k.startsWith(`${prefix}${namespace}:`));
    if(keys.length <= maxEntries) return;
    const arr = keys.map(k => {
      try { const raw = deserialize(adapter.getItem(k)!); return { k, ts: raw?.ts || 0 }; } catch { return { k, ts: 0 }; }
    }).sort((a,b) => a.ts - b.ts); // oldest first
    const removeCount = keys.length - maxEntries;
    arr.slice(0, removeCount).forEach(e => { purge(e.k); emit('evict', e.k); });
  }

  // Convenience wrappers for common patterns
  function keyForData(params: Record<string, any>) { return buildKey('data', params); }
  function keyForMarkup(params: Record<string, any>) { return buildKey('markup', params); }

  function setData<T>(params: Record<string, any>, data: T, cfg?: { ttl?: number; meta?: Record<string, any> }) {
    write(keyForData(params), 'data', data, cfg);
  }

  function getData<T>(params: Record<string, any>): CacheGetResult<T> {
    return get<T>(keyForData(params));
  }

  function getOrSetData<T>(params: Record<string, any>, fetcher: () => Promise<T>, opts?: GetOrSetOptions<T>) {
    return getOrSet(keyForData(params), 'data', fetcher, opts);
  }

  function setMarkup(params: Record<string, any>, html: string, cfg?: { ttl?: number; meta?: Record<string, any> }) {
    write(keyForMarkup(params), 'markup', html, cfg);
  }

  function getMarkup(params: Record<string, any>): CacheGetResult<string> {
    return get<string>(keyForMarkup(params));
  }

  function getOrSetMarkup(params: Record<string, any>, producer: () => Promise<string>, opts?: GetOrSetOptions<string>) {
    return getOrSet(keyForMarkup(params), 'markup', producer, opts);
  }

  return {
    // generic
    buildKey,
    get,
    set: write,
    getOrSet,
    refresh,
    purge,
    purgePattern,
    clearNamespace,
    inflight,
    // data-specific helpers
    keyForData,
    getData,
    setData,
    getOrSetData,
    // markup-specific helpers
    keyForMarkup,
    getMarkup,
    setMarkup,
    getOrSetMarkup
  };
}

function resolveAdapter(sel: 'local' | 'session' | 'memory'): StorageAdapter {
  if(sel === 'memory') return createMemoryAdapter();
  const store = safeStorage(sel === 'session' ? 'session' : 'local');
  if(!store) return createMemoryAdapter();
  return {
    getItem: k => store.getItem(k),
    setItem: (k,v) => store.setItem(k,v),
    removeItem: k => store.removeItem(k),
    keys: () => {
      const arr: string[] = [];
      for(let i=0;i<store.length;i++) { const key = store.key(i); if(key) arr.push(key); }
      return arr;
    }
  };
}

function safeStorage(type: 'local' | 'session'): Storage | undefined {
  try {
    if(typeof window === 'undefined') return undefined;
    const s = type === 'local' ? window.localStorage : window.sessionStorage;
    const testKey = '__iv_cache_test__';
    s.setItem(testKey, '1');
    s.removeItem(testKey);
    return s;
  } catch { return undefined; }
}

function createMemoryAdapter(): StorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem: k => map.get(k) || null,
    setItem: (k,v) => { map.set(k,v); },
    removeItem: k => { map.delete(k); },
    keys: () => Array.from(map.keys())
  };
}

function byteLength(str: string) {
  if(typeof Blob !== 'undefined') return new Blob([str]).size;
  // fallback rough estimate
  return encodeURIComponent(str).replace(/%../g, 'x').length;
}

/*
USAGE EXAMPLES (iv-dynamic-products):

import { createCache } from '../../utils/caching/factory';
import { fetchProducts } from '../../utils/storefront_api/factory';

const productCache = createCache({
  namespace: 'iv-dynamic-products',
  version: '1',
  storage: 'local',
  defaultTTL: 1000 * 60 * 5,        // 5 minutes fresh
  staleTTL: 1000 * 60 * 5           // additional 5 minutes stale window
});

async function loadProducts(params) {
  const data = await productCache.getOrSetData(
    { handle: params.handle, sort: params.sort, fields: params.fields, limit: params.limit, currency: params.currency },
    () => fetchProducts(params),
    { ttl: 1000 * 60 * 5, staleWhileRevalidate: true }
  );
  // assign to component state & let Stencil render
  this.products = data;
}

// Optional MARKUP caching (only if safe & static):
async function getMarkupFast(params) {
  return productCache.getOrSetMarkup(
    { handle: params.handle, sort: params.sort, limit: params.limit },
    async () => {
      const data = await fetchProducts(params);
      // build HTML string (ensure no dynamic listeners needed)
      return data.map(p => `<div class=\"iv-card\">${p.title}</div>`).join('');
    },
    { ttl: 1000 * 60 * 2, staleWhileRevalidate: true }
  );
}

/*
============================================================
CACHING FACTORY – USAGE & RATIONALE NOTES
============================================================
Purpose:
  Provide a unified, lightweight, observable cache for normalized DATA (preferred) and optionally static MARKUP.
  Designed to prevent redundant Shopify Storefront API calls across multiple component instances / navigations.

Core Concepts:
  Key Derivation: stable, deterministic hash of (params + namespace + version + type).
  Data vs Markup: Markup support exists but is discouraged for interactive Stencil components (event binding loss).
  Fresh vs Stale vs Expired:
    - fresh: age <= ttl
    - expired + stale window active: treat as stale (returned immediately if staleWhileRevalidate enabled)
    - expired beyond stale window: treated as miss
  Stale‑While‑Revalidate: returns stale value immediately while background refresh updates cache.
  Inflight Dedupe: concurrent requests for same key share the same Promise.
  Size Guard: prevents storing overly large payloads (default ~250KB serialized).
  Soft Eviction: oldest entries removed when exceeding maxEntries (checked every 20 writes).
  Events: CustomEvent 'iv-cache' with actions (hit|miss|stale|set|purge|error|evict) for telemetry / debugging.

Recommended Usage Pattern (Data):
  1. Create one shared cache per domain concern (e.g. productCache, predictiveSearchCache).
  2. Always cache normalized data objects – keep UI rendering inside Stencil.
  3. Include parameters that materially affect the response in the key params object (collection handle, sort key, limit, currency).
  4. Use staleWhileRevalidate for UX smoothness (fast paint + silent refresh).
  5. Avoid caching partial markup for interactive components.

Example (Products):
  import { productCache } from '../caching/productCache';
  import { fetchProducts } from '../storefront_api/factory';
  const products = await productCache.getOrSetData(
    { handle, sort, limit, fields, currency },
    () => fetchProducts({ collectionHandle: handle, sortKey: sort, limit, fields }),
    { ttl: 1000 * 60 * 5, staleWhileRevalidate: true }
  );

Deciding TTL / Stale:
  High traffic / slow changing catalog: longer ttl (5–15m) + generous stale window.
  Rapidly changing pricing/inventory: shorter ttl (1–2m) or disable stale if consistency is critical.

When NOT to Use This Cache:
  - Server authoritative real-time inventory checks pre‑purchase.
  - Personalized data (user-specific recommendations) unless key includes identity.
  - Security sensitive payloads (never store secrets / tokens).

Extensibility Ideas:
  - BroadcastChannel or storage event listener to sync invalidations across tabs.
  - Add diff hashing of payload to skip downstream re-renders.
  - Integrate global telemetry to record hit/miss ratio.

Debugging Tips:
  window.addEventListener('iv-cache', e => console.log('cache event', e.detail));
  productCache.clearNamespace() // manual purge

Migration Path If Dropping Markup:
  1. Remove 'markup' references and helpers.
  2. Narrow CacheStored.t to implicit 'data'.
  3. Delete keyForMarkup / setMarkup / getMarkup / getOrSetMarkup usages.

Safety Notes:
  - Serialization errors are caught and emitted as 'error' events.
  - Oversize entries are skipped (no partial writes).
  - Stale return path never blocks UI; refresh runs through same deduped pipeline.
============================================================
*/
