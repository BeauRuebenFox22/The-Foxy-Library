import { showToast } from '../store/store';

export type errorSeverity = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface NormalizedError {
  id: string;
  ts: number;
  component?: string;
  scope: string;
  severity: errorSeverity;
  userSafe: boolean;
  userMessage?: string;
  devMessage?: string;
  raw?: any;
  meta?: Record<string, any>;
  deduped?: boolean;
  stack?: string;
};

interface TelemetryConfig {
  record: (n: NormalizedError) => void | Promise<void>;
  sampleRate?: number;
  filter?: (n: NormalizedError) => boolean;
  enrich?: (n: NormalizedError) => Partial<NormalizedError>;
};

interface CreateHandlerConfig {
  component?: string;
  toast?: (opts: { message: string; variant?: string }) => void; 
  toastDuration?: number;
  emitEvents?: boolean;
  target?: HTMLElement | Window;
  classifier?: (ctx: { error: any; scope: string }) => Partial<{ userSafe: boolean; severity: errorSeverity; userMessage: string }>;
  dedupeMs?: number;
  defaultUserMessage?: string;
  maxConsoleStack?: number;
  telemetry?: TelemetryConfig;
  _sharedRecent?: Map<string, number>;
};

interface HandleOptions {
  error: any;
  scope: string;
  userMessage?: string;
  devMessage?: string;
  severity?: errorSeverity;
  level?: errorSeverity;
  emitEvent?: boolean;
  meta?: Record<string, any>;
};

export function createErrorHandler(config: CreateHandlerConfig = {}) {
  const {
    component,
    toast,
    toastDuration = 3000,
    emitEvents = true,
    target = window,
    classifier,
    dedupeMs = 4000,
    defaultUserMessage = 'Something went wrong. Please try again.',
    maxConsoleStack = 6,
    telemetry,
    _sharedRecent
  } = config;

  const recent = _sharedRecent || new Map<string, number>();

  function severityToToastType(sev: errorSeverity): 'info' | 'success' | 'warning' | 'error' {
    if(sev === 'warn') return 'warning';
    if(sev === 'debug' || sev === 'info') return 'info';
    return 'error';
  };

  function dispatchToast(message: string, severity: errorSeverity) {
    const type = severityToToastType(severity);
    try {
      toast ? toast({ message, variant: type }) : showToast(message, type, toastDuration);
    } catch(_) { /* swallow toast errors */ };
  };
  
  function classify(base: HandleOptions): { userSafe: boolean; severity: errorSeverity; userMessage?: string } {
    let severity: errorSeverity = base.severity || base.level || 'error';
    let userSafe = !!base.userMessage;
    let userMessage = base.userMessage;
    const err = base.error;
    const isNetwork = err?.name === 'TypeError' && /fetch/i.test(err?.message || '');
    if(isNetwork) { userSafe = true; userMessage ||= 'Network issue. Please retry.'; };
    const status = err?.status || err?.response?.status;
    if(status) {
      if(status >= 400 && status < 500) userSafe = true;
      if(status >= 500) { userSafe = false; severity = 'error'; }    
    };
    if(!userMessage && userSafe) userMessage = defaultUserMessage;
    if(classifier) {
      const override = classifier({ error: err, scope: base.scope }) || {};
      if(override.userSafe !== undefined) userSafe = override.userSafe;
      if(override.severity) severity = override.severity;
      if(override.userMessage) userMessage = override.userMessage;
    };
    if(!userSafe) userMessage = undefined;
    return { userSafe, severity, userMessage };
  };

  function dedupeKey(n: NormalizedError) {
    return `${n.component||''}|${n.scope}|${n.devMessage||n.userMessage||n.raw?.message||''}|${n.severity}`;
  };

  function handle(opts: HandleOptions): NormalizedError {
    const { error, scope, devMessage, meta } = opts;
    const { userSafe, severity, userMessage } = classify(opts);
    const stack = (error?.stack || '').split('\n').slice(0, maxConsoleStack).join('\n');
    const normalized: NormalizedError = {
      id: crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2),
      ts: Date.now(),
      component,
      scope,
      severity,
      userSafe,
      userMessage,
      devMessage: devMessage ?? (userSafe ? error?.message : undefined),
      raw: error,
      meta,
      stack
    };
    
    if(telemetry?.enrich) {
      try { Object.assign(normalized, telemetry.enrich(normalized)); } catch(_) {}
    };

    const key = dedupeKey(normalized);
    const last = recent.get(key);
    last && (Date.now() - last) < dedupeMs ? normalized.deduped = true : recent.set(key, Date.now());

    const consolePayload = { ...normalized, raw: undefined };
    if(severity === 'debug') console.debug('[iv-error]', consolePayload, error);
    else if(severity === 'info') console.info('[iv-error]', consolePayload, error);
    else if(severity === 'warn') console.warn('[iv-error]', consolePayload, error);
    else console.error('[iv-error]', consolePayload, error);
    
    if(userSafe && !normalized.deduped && userMessage) {
      dispatchToast(userMessage, severity);
    };
    
    if(emitEvents && (opts.emitEvent !== false) && target && typeof (target as any).dispatchEvent === 'function') {
      try {
        target.dispatchEvent(new CustomEvent('iv-error', { detail: normalized, bubbles: true, composed: true }));
      } catch(_) {}
    };

    if(telemetry && (!telemetry.sampleRate || Math.random() < telemetry.sampleRate)) {
      if(!telemetry.filter || telemetry.filter(normalized)) {
        try { Promise.resolve(telemetry.record(normalized)).catch(()=>{}); } catch(_) {}
      };
    };
    return normalized;
  };
  return { handle };
};

// Usage in a component:
/*
import { createErrorHandler } from '../../utils/error_handling/factory';
const errors = createErrorHandler({ component: 'iv-dynamic-products', toast: showToast });

try {
  await fetchProducts(...);
} catch(err) {
  errors.handle({
    error: err,
    scope: 'fetchProducts',
    userMessage: 'Could not load products.',
    devMessage: 'Storefront API fetch failed',
    severity: 'error'
  });
}

So simplest component usage: 
const errors = createErrorHandler({ component: 'iv-card' }); try { ... } catch (e) { errors.handle({ error: e, scope: 'load', userMessage: 'Failed to load.' }); }
*/