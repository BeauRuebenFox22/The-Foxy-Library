import { state } from '../../utils/store/store';

export function apiSetup() {
  let url = document.documentElement.getAttribute('store-url');
  let token = document.documentElement.getAttribute('store-token');
  if(!url || !token) {
    console.error('[Intravenous] Missing store-url or store-token attribute on <html>.');
    return;
  };
  if(url && !url.includes('.myshopify.com')) {
    url = url + '.myshopify.com';
  };
  state.shopDomain = url;
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