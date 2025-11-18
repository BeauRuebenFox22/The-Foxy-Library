import { fetchShopifyCurrencyCode } from '../utils/config/factory';
import { state } from '../utils/store/store';
import { apiConfig } from '../utils/storefront_api';
import { createErrorHandler } from '../utils/error_handling/factory';

const errors = createErrorHandler({ component: 'global-init-function' });

export default async function init(): Promise<void> {
  apiConfig.connect();
  try {
    if(!apiConfig.isConnected()) throw new Error('Shopify Storefront API not connected');
    state.apiConnected = true
    state.currencyCode = (await fetchShopifyCurrencyCode()) || 'GBP';
  } catch(error) {
    errors.handle({
      error,
      scope: 'globalInit',
      userMessage: 'Unable to connect to the store right now.',
      devMessage: 'Global init failed to connect Storefront API',
      severity: 'error'
    });
  };
};

init();