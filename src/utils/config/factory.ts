import { state } from '../../utils/store/store';
import { createErrorHandler } from '../../utils/error_handling/factory';

const errors = createErrorHandler({ component: 'iv-set-up' });

export function setStoreDomain() {
  try {
    const storeUrl = typeof window !== 'undefined' && window.location ? window.location.hostname : '';
    if(!storeUrl) throw new Error('Could not set store domain.');
    state.shopDomain = storeUrl;
  } catch(err: any) {
    errors.handle({
      error: err,
      scope: 'SetStoreDomain',
      userMessage: 'Something has gone wrong, please try again.',
      devMessage: 'Failed to set store domain in store.ts',
      severity: 'critical'
    });
  };
};

// Check where this is called! 
export function apiSetup() {
  let token = document.documentElement.getAttribute('store-token');
  if(!token) {
    console.error('[Intravenous] Missing store-url or store-token attribute on <html>.');
    return;
  };
  if(state.shopDomain && !state.shopDomain.includes('.myshopify.com')) {
    state.shopDomain = state.shopDomain + '.myshopify.com';
  };
  state.storefrontToken = token;
};

if(typeof window !== 'undefined') {
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apiSetup);
  } else {
    apiSetup();
  };
};

export async function fetchShopifyCurrencyCode(): Promise<string> {
  try {
    const url = '/cart.js';
    const response = await fetch(url);
    const data = await response.json();
    return data.currency || 'GBP';
  } catch (error) {
    console.error('Error fetching cart:', error);
    return 'GBP';
  };
};