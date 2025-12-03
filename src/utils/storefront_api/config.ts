import { createErrorHandler } from '../../utils/error_handling/factory';
import { ConfigBlueprint } from './blueprint';

class StorefrontConfig implements ConfigBlueprint {
  domain = '';
  token = '';
  endpoint = '';
  apiVersion = '2025-10';

  private errors = createErrorHandler({ component: 'storefront-api-module-config' });

  constructor(apiVersion?: string) {
    if(apiVersion) this.apiVersion = apiVersion;
  };

  connect(): void {
    try {
      this.domain = this.getDomain();
      this.token = this.getTokenFromDOM();
      if(!this.domain || !this.token) throw new Error('Missing Shopify configuration (domain/token)');
      this.endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
    } catch(error: any) {
      this.errors.handle({
        error,
        scope: 'ApiConfigConnect',
        userMessage: 'Unable to connect to the API right now.',
        devMessage: 'ApiConfigConnect failed in storefront-api-module-config',
        severity: 'error'
      });
    };
  };

  isConnected(): boolean {
    return !!(this.domain && this.token && this.endpoint);
  };

  debug(): void {
    console.debug('[IV] StorefrontConfig:', {
      domain: this.domain,
      token: this.token,
      endpoint: this.endpoint,
      apiVersion: this.apiVersion
    });
  };

  private getTokenFromDOM(): string | null {
    return document.documentElement.getAttribute('store-token');
  };

  private configureEndpointFromDomain(domain: string): string {
    const shopName = domain.split('.')[0];
    return `${shopName}.myshopify.com`;
  };

  private getDomain(): string | null {
    const domain = window.location.hostname;
    return this.configureEndpointFromDomain(domain);
  };

  static fromDOM(apiVersion?: string): StorefrontConfig {
    const config = new StorefrontConfig(apiVersion);
    config.connect();
    return config;
  };
};

export const apiConfig = StorefrontConfig.fromDOM();