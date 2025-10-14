// Shared product cache singleton for product-related data across components.
// Focused on data (not markup) to preserve Stencil lifecycle & event binding.
// Includes stale-while-revalidate so multiple component instances reuse results.

import { createCache } from './factory';

export const productCache = createCache({
  namespace: 'products',
  version: '1',
  storage: 'local',
  defaultTTL: 1000 * 60 * 5, // 5 minutes fresh
  staleTTL: 1000 * 60 * 5,   // additional 5 minutes stale window
  dispatchEvents: true
});

export type ProductCacheParams = {
  handle: string;
  sort: string;
  fields: string;
  limit: number;
  currency: string;
};

/*
============================================================
PRODUCT CACHE – USAGE NOTES
============================================================
Goal:
  Provide a shared, cross-component data cache for normalized Shopify product lists.
  Prevents duplicate Storefront API queries when multiple components (e.g. carousels, grids) request the same dataset.

Why Data (Not Markup):
  Data caching keeps Stencil's render lifecycle & event listeners intact.
  Markup caching risks stale styling, missed hydration, lost interactivity.

Key Parameters Included in Cache Key:
  handle   : collection or 'all'
  sort     : sort key (BEST_SELLING, PRICE, etc.)
  fields   : requested GraphQL fields (affects shape / payload size)
  limit    : number of products
  currency : ensures price formatting differences are segregated

Stale-While-Revalidate Flow:
  1. Fresh hit -> returned immediately.
  2. Expired but within stale window + staleWhileRevalidate=true -> stale data returned; background refresh updates cache.
  3. Expired beyond stale window -> treated as miss; new fetch awaited.

Basic Usage in a Component:
  import { productCache } from '../../utils/caching/productCache';
  import { fetchProducts } from '../../utils/storefront_api/factory';

  async function load() {
    const params = { handle: 'all', sort: 'BEST_SELLING', fields: 'id,title,images', limit: 8, currency: 'GBP' };
    const products = await productCache.getOrSetData(
      params,
      () => fetchProducts({
        collectionHandle: params.handle,
        sortKey: params.sort,
        limit: params.limit,
        fields: params.fields,
      }),
      { ttl: 1000 * 60 * 5, staleWhileRevalidate: true }
    );
    // render products...
  }

Listening for Cache Diagnostics:
  window.addEventListener('iv-cache', e => {
    const { action, key, namespace, info } = (e as CustomEvent).detail;
    if(namespace === 'products') console.debug('[productCache]', action, { key, info });
  });

Manual Invalidation Examples:
  productCache.clearNamespace(); // purge everything in 'products'
  // or targeted:
  // productCache.purge(specificKey);

Adjusting Freshness Strategy:
  - High stability content: increase defaultTTL (10–15m) + keep staleTTL (same or larger).
  - Rapid inventory changes: shorten TTL (1–2m) or disable staleWhileRevalidate on critical views.

Extending:
  - Add a lightweight wrapper that injects user segment into params if personalization introduced.
  - Introduce a background warm-up (call getOrSetData on route prefetch).

Safety:
  - Oversize payloads are ignored (error event emitted) to guard storage quota.
  - Serialization failures fail open (miss on next access).
============================================================
*/
