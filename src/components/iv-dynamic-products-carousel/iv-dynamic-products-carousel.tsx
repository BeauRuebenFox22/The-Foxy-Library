import { Component, h, Prop, State, Watch } from '@stencil/core';
import { state } from '../../utils/store/store';
import { fetchProducts } from '../../utils/storefront_api/factory';
import { productCache } from '../../utils/caching/productCache';
import { createErrorHandler } from '../../utils/error_handling/factory';

const BLOCK = 'iv-dynamic-products-carousel';

@Component({
  tag: 'iv-dynamic-products-carousel',
  styleUrl: 'iv-dynamic-products-carousel.scss',
  shadow: false
})

export class IvDynamicProducts {
  @Prop() type: 'CREATED' | 'BEST_SELLING' | 'PRICE' | 'TITLE' | 'RELEVANCE' = 'CREATED'; 
  @Prop() limit: number = 24;
  @Prop() reversed: boolean = false; 
  @Prop() componenttitle?: string;
  @Prop() titletag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2';
  @Prop() collectionhandle: string = 'all';
  @Prop() requestedfields: string;
  @Prop() calltoaction: boolean = false;
  @Prop() buttontext?: string;
  @Prop() addtocarttext?: string;
  @Prop() emptystring: string = 'No products found';
  @Prop() cachettl?: number; 
  @Prop() stale?: boolean = true;   

  @State() products: any[] = [];
  @State() errorMsg: string; 
  @State() staleData: boolean = false;
  @State() page: number = 0; // current slide index
  private readonly itemsPerPage = 6;

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
      handle: this.collectionhandle,
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
      this.page = 0;
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

  private pagedProducts() {
    const chunks: any[][] = [];
    for(let i=0; i < this.products.length; i += this.itemsPerPage) {
      chunks.push(this.products.slice(i, i + this.itemsPerPage));
    }
    return chunks;
  }

  // removed unused clampPage and resetPageOnDataChange

  private next = () => { const pages = this.pagedProducts().length; if(this.page < pages - 1) this.page++; };
  private prev = () => { if(this.page > 0) this.page--; };

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
          <div class={`${BLOCK}-carousel`} aria-roledescription="carousel">
            <button class={`${BLOCK}-nav ${BLOCK}-nav-prev`} onClick={this.prev} disabled={this.page===0} aria-label="Previous" type="button">‹</button>
            <div class={`${BLOCK}-viewport`}>
              <div class={`${BLOCK}-track`} style={{ transform: `translateX(-${this.page * 100}%)` }}>
                {this.pagedProducts().map((group, i) => (
                  <div class={`${BLOCK}-slide`} role="group" aria-label={`Slide ${i+1} of ${this.pagedProducts().length}`}> 
                    {group.map(product => (
                      <iv-card
                        cardtype='products'
                        calltoaction={this.calltoaction}
                        buttontext={this.buttontext}
                        addtocarttext={this.addtocarttext}
                        data={product}
                        classmodifier={`${BLOCK}-card`} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button class={`${BLOCK}-nav ${BLOCK}-nav-next`} onClick={this.next} disabled={this.page===this.pagedProducts().length-1} aria-label="Next" type="button">›</button>
            <div class={`${BLOCK}-status`} aria-live="polite">{this.pagedProducts().length > 1 ? `Slide ${this.page+1} of ${this.pagedProducts().length}` : ''}</div>
            {this.staleData && (
              <div class={`${BLOCK}-stale-indicator`} aria-live="polite">Refreshing…</div>
            )}
          </div>
        )}
      </div>
    );
  };

};