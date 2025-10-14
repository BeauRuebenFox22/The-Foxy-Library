import { Component, h, Prop, State, Watch } from '@stencil/core';
import { state } from '../../utils/store/store';
import { fetchProducts } from '../../utils/storefront_api/factory';
import { productCache } from '../../utils/caching/productCache';
import { createErrorHandler } from '../../utils/error_handling/factory';

const BLOCK = 'iv-dynamic-products';

@Component({
  tag: 'iv-dynamic-products',
  styleUrl: 'iv-dynamic-products.scss',
  shadow: false
})

export class IvDynamicProducts {

  // @Prop() type: 'CREATED_AT' | 'BEST_SELLING' | 'PRICE' | 'TITLE' | 'RELEVANCE' = 'BEST_SELLING'; 
  @Prop() type: 'CREATED' | 'BEST_SELLING' | 'PRICE' | 'TITLE' | 'RELEVANCE' = 'CREATED'; 
  @Prop() limit: number = 8;
  @Prop() reversed: boolean = false; 
  @Prop() componenttitle?: string;
  @Prop() titletag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';
  @Prop() collectionhandle: string = 'all';
  
  @Prop() carousel: boolean = false; 
  
  @Prop() requestedfields: string;
  @Prop() calltoaction: boolean = false;
  @Prop() buttontext?: string;
  @Prop() addtocarttext?: string;
  @Prop() emptystring: string = 'No products found';
  @Prop() gridlayout?: string; // If this and carousel all false, default to flex
  @Prop() cachettl?: number; // override TTL (ms)
  @Prop() stale?: boolean = true; // enable stale-while-revalidate

  @State() products: any[] = [];
  @State() errorMsg: string; 
  @State() staleData: boolean = false; // indicates we are showing stale data while refreshing

  private errors = createErrorHandler({ component: 'iv-dynamic-products' });

  @Watch('type')
  @Watch('limit')
  @Watch('collectionhandle')
  @Watch('requestedfields')
  handlePropChange() { this.loadProducts(true); }

  async componentWillLoad() { 
    await this.loadProducts(false); 
  };
  
  private buildParams() {
    return {
      handle: this.collectionhandle || 'all',
      sort: this.type,
      fields: this.requestedfields,
      limit: this.limit,
      currency: state.currencyCode,
      reversed: this.reversed
    };
  };

  private async loadProducts(fromWatch: boolean) {
    const params = this.buildParams();
    const ttl = this.cachettl || 1000 * 60 * 5;
    state.loading = !fromWatch; 
    try {
      const data = await productCache.getOrSetData(
        params,
        async () => {
          const fresh = await fetchProducts(this.limit, this.collectionhandle, this.type, this.requestedfields, this.reversed);
          return fresh;
        },
        {
          ttl,
          staleWhileRevalidate: this.stale,
          transform: (fresh) => fresh 
        }
      );
      const metaCheck = productCache.getData<typeof data>(params);
      this.staleData = metaCheck.isExpired && metaCheck.isStale;
      this.products = data || [];
    } catch (err: any) {
      this.errorMsg = 'Failed to load products';
      this.errors.handle({
        error: err,
        scope: 'loadProducts',
        userMessage: 'Unable to load products right now.',
        devMessage: 'fetchProducts failed in iv-dynamic-products',
        severity: 'error'
      });
    } finally {
      state.loading = false;
    };
  };

  render() {
    const TAG = this.titletag as any;

    return (
      <div class={BLOCK} data-stale={this.staleData ? 'true' : 'false'}>
        {this.componenttitle && <TAG class={`${BLOCK}-title`}>{this.componenttitle}</TAG>}
        {state.loading ? (
          <iv-spinner></iv-spinner>
        ) : this.errorMsg ? (
          <div class={`${BLOCK}-error`}>{this.errorMsg}</div>
        ) : this.products.length === 0 ? (
          <div class={`${BLOCK}-empty`}>{this.emptystring}</div>
        ) : (
          <div class={`${BLOCK}-products`}> 
            <iv-layout
              classModifier={`${BLOCK}-layout`}
              gridTemplateAreas={this.gridlayout}>
              {this.products.map(product => (
                <iv-card
                  cardtype='products'
                  calltoaction={this.calltoaction}
                  buttontext={this.buttontext}
                  addtocarttext={this.addtocarttext}
                  data={product} 
                  classmodifier={`${BLOCK}-card`}/>
              ))}
            </iv-layout>
            {this.staleData && (
              <div class={`${BLOCK}-stale-indicator`} aria-live="polite">Refreshing…</div>
            )}
          </div>
        )}
      </div>
    );
  };

};