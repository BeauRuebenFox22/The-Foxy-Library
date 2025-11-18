import { createStore } from '@stencil/store';

// Reinstate singleton + diagnostics
declare global {
  interface Window {
    __IV_STORE_STATE?: any;
    __IV_STORE_INIT_COUNT?: number;
    __IV_TOAST_ID?: number;
    ivShowToast?: typeof showToast;
    __IV_STORE_ONCHANGE?: any;
  }
}

export interface ToastItem { id: number; message: string; type: 'info' | 'success' | 'warning' | 'error'; duration: number; }

function createInitialStoreState() {
  return {
    _instanceId: Math.random().toString(36).slice(2),
    storefrontToken: null as string | null,
    shopDomain: null as string | null,
    currencyCode: 'GBP' as string,
    modalIsOpen: false,
    modalContent: null as string | null,
    pulloutOpen: false as boolean,
    pulloutContent: null as string,
    loading: false as boolean,
    wishlistLabels: {
      removeLabel: null as string,
      addToCartLabel: null as string,
      emptyMessage: null as string
    },
    toasts: [] as ToastItem[],
    wishlist: [] as Array<Record<string, any>>,
    apiConnected: false as boolean
  };
}

let stateRef: any;

(function init(){
  if (typeof window !== 'undefined') {
    if (!window.__IV_STORE_STATE) {
      const { state, onChange } = createStore(createInitialStoreState());
      window.__IV_STORE_STATE = state;
      window.__IV_STORE_ONCHANGE = onChange;
      window.__IV_STORE_INIT_COUNT = (window.__IV_STORE_INIT_COUNT || 0) + 1;
      console.debug('[iv-store] Store initialized instanceId=', state._instanceId, 'initCount=', window.__IV_STORE_INIT_COUNT);
    } else {
      window.__IV_STORE_INIT_COUNT = (window.__IV_STORE_INIT_COUNT || 0) + 1; // still track
      if (window.__IV_STORE_INIT_COUNT! > 1) {
        console.warn('[iv-store] Duplicate store access initCount=', window.__IV_STORE_INIT_COUNT, 'existingInstanceId=', window.__IV_STORE_STATE._instanceId);
      }
    }
    stateRef = window.__IV_STORE_STATE;
    window.__IV_TOAST_ID = window.__IV_TOAST_ID || 0;
  } else {
    // SSR fallback
    const { state, onChange } = createStore(createInitialStoreState());
    stateRef = state;
    (stateRef as any).__onChange = onChange; // local reference
  }
})();

export const state = stateRef;
export const onStoreChange: any = (typeof window !== 'undefined') ? (window as any).__IV_STORE_ONCHANGE : (stateRef as any).__onChange;

function nextToastId(): number {
  if (typeof window !== 'undefined') {
    window.__IV_TOAST_ID = (window.__IV_TOAST_ID || 0) + 1;
    return window.__IV_TOAST_ID;
  }
  (nextToastId as any)._c = ((nextToastId as any)._c || 0) + 1;
  return (nextToastId as any)._c;
}

export function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) {
  const id = nextToastId();
  const inst = state._instanceId;
  state.toasts = [...state.toasts, { id, message, type, duration }];
  console.debug('[iv-toast] showToast', { id, message, type, duration, instanceId: inst, totalToasts: state.toasts.length });
  try { document.dispatchEvent(new CustomEvent('iv:toast', { detail: { id, message, type, duration } })); } catch {}
  if (typeof window !== 'undefined') window.ivShowToast = showToast; // debug helper
  setTimeout(() => {
    state.toasts = state.toasts.filter(t => t.id !== id);
  }, duration);
}

export function removeFromWishlist(id: number | string) {
  state.loading = true;
  state.wishlist = state.wishlist.filter(item => item.id !== id);
  try { localStorage.setItem('wishlist', JSON.stringify(state.wishlist)); } catch {}
  state.loading = false;
  showToast('Item removed from wishlist', 'success', 5000);
}

export function toggleModal(content?: string) {
  state.modalIsOpen = !state.modalIsOpen;
  state.modalContent = content || null;
}

export function togglePullout(content?: string) {
  state.pulloutOpen = !state.pulloutOpen;
  state.pulloutContent = content || null;
}