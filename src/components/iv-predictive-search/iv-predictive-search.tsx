import { Component, h, Prop, State, Event } from '@stencil/core';
import { state } from '../../utils/store/store';
import { formatMoney, getCurrencySymbol } from '../../utils/helpers/factory';

const ALLOWED_FIELDS = [
  'featured_image', 'image', 'title', 'price', 'price_formatted', 'currency', 'description', 'vendor', 'url',
  'id', 'handle', 'author', 'published_at', 'product_type', 'type', 'tags'
];

const ALLOWED_RESOURCES = ['page', 'collection', 'product', 'article'];

const FIELD_ALIASES: Record<string, string> = {
  type: 'product_type',
  img: 'image'
};

const BLOCK = 'iv-predictive-search';

@Component({
  tag: 'iv-predictive-search',
  styleUrl: 'iv-predictive-search.scss',
  shadow: false,
})

export class IvPredictiveSearch {

  @Prop() searchlabel?: string;
  @Prop() labelposition?: 'inline' | 'top' = 'top'; 
  @Prop() action?: string;
  @Prop() placeholder?: string;
  @Prop() minchars: number = 3;
  @Prop() resultslimit: number = 5;
  @Prop() showspinner?: boolean;
  @Prop() noresultstext: string = 'No results found';
  @Prop() requestedfields: string = 'title';
  @Prop() requestedresources: string = 'product,article,page,collection';
  @Prop() showallbuttontext?: string;
  @Prop() querybuttontext?: string;
  @Prop() clearbutton?: string;
  @Prop() expandable: boolean = false;
  @Prop() tablayout?: string;
  @Prop() gridlayout?: string;
      
  @State() searchTerm: string;
  @State() searchReturnData: any[] = [];
  @State() noResults: boolean = false;

  @Event() searchTermsChanged: any;

  // Internals
  private readonly debounce = 3000;
  private debounceTimer: any;
  private abortController?: AbortController;
  private cache = new Map<string, any>(); 

  // Helpers
  private normalizeAction(a?: string) {
    return (a && a.trim() ? a : '/search').replace(/\/+$/, '');
  };

  private parseRequestedFields(): string[] {
    const raw = (this.requestedfields || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(f => FIELD_ALIASES[f] || f);
    const fields = Array.from(new Set(raw.filter(f => ALLOWED_FIELDS.includes(f))));
    if(!fields.includes('resource')) fields.push('resource');
    return fields;
  };

  private normalizeImageUrl(src: any): string | undefined {
    const s = typeof src === 'string' ? src : (src?.url || src?.src || undefined);
    if(!s) return undefined;
    return s.startsWith('//') ? `https:${s}` : s;
  };

  // Getters
  private get hasRenderableResults(): boolean {
    return !!this.searchTerm && this.searchTerm.length >= this.minchars && this.searchReturnData.length > 0;
  };

  private get resultsListId(): string {
    return `${BLOCK}-results`;
  };

  private get tabLabels(): string[] {
    const resources = Array.from(new Set(this.searchReturnData.map(item => item.resource)));
    return resources;
  };

  private get useGridLayout(): boolean {
    return !!this.gridlayout;
  };

  private get gridTemplateAreas(): string {
    return this.gridlayout
      ? this.gridlayout.split(',').map(row => `"${row.trim()}"`).join(' ')
      : '';
  };

  private get gridAreaNames(): string[] {
    return Array.from(new Set(this.searchReturnData.map(item => item.resource)));
  };

  // Methods
  private confirmRequestedResources(): string {
    const resources = this.requestedresources
      .split(',')
      .map(r => r.trim())
      .filter(Boolean)
      .filter(r => ALLOWED_RESOURCES.includes(r));
    if(resources.length === 0) {
      console.warn('No valid resources specified, defaulting to "product,article,page,collection"');
      return 'product,article,page,collection';
    };
    return resources.join(',');
  };

  private async fetchPredictive(term: string) {
    const trimmed = term.trim();
    if(!trimmed || trimmed.length < this.minchars) {
      this.searchReturnData = [];
      this.noResults = false;
      return;
    };
    if(this.cache.has(trimmed)) {
      this.searchReturnData = this.cache.get(trimmed);
      this.noResults = (this.searchReturnData?.length ?? 0) === 0;
      return;
    };
    if(this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    const base = this.normalizeAction(this.action);
    const params = new URLSearchParams();
    params.set('q', trimmed);
    params.set('resources[type]', this.confirmRequestedResources()); 
    params.set('resources[limit]', String(this.resultslimit));
    const url = `${base}/suggest.json?${params.toString()}`;
    state.loading = true;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-store',
        },
        cache: 'no-store',
        signal: this.abortController.signal,
      });
      if(!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      const json = await res.json();
      const normalized = this.normalizeShopifyResponse(json);
      this.searchReturnData = normalized;
      this.noResults = normalized.length === 0;
      this.cache.set(trimmed, normalized);
    } catch(err) {
      if((err as any)?.name !== 'AbortError') {
        console.error('Predictive search error:', err);
        this.searchReturnData = [];
        this.noResults = false;
      };
    } finally {
      state.loading = false;
      this.searchTermsChanged.emit(trimmed);
    };
  };

  private normalizeShopifyResponse(payload: any): any[] {
    const out: any[] = [];
    const buckets =
      payload?.resources?.results ??
      payload?.resources ??
      {};
    const mapType = (key: string) =>
      key === 'products' ? 'product' :
      key === 'collections' ? 'collection' :
      key === 'articles' ? 'article' :
      key === 'pages' ? 'page' : key;
    const pushItems = (items: any[], typeKey: string) => {
      const resource = mapType(typeKey);
      items.forEach(item => out.push(this.pickFieldsByResource(item, resource)));
    };
    ['products', 'collections', 'articles', 'pages'].forEach(typeKey => {
      const list = buckets?.[typeKey] || [];
      if(Array.isArray(list)) pushItems(list, typeKey);
    });
    return out;
  };

  private pickFieldsByResource(item: any, resource: string) {
    const url = item?.url || item?.online_store_url || item?.path || '';
    const handle = item?.handle || '';
    const id = item?.id ?? item?.legacyResourceId ?? item?.legacy_resource_id ?? undefined;
    const title = item?.title || item?.name || item?.page_title || '';
    const description =
      item?.body ||
      item?.body_html ||
      item?.excerpt ||
      item?.description ||
      '';
    const vendor = item?.vendor || item?.author || '';
    const author = item?.author || '';
    const published_at = item?.published_at || item?.created_at || '';
    const product_type = item?.product_type || item?.type || '';
    const image =
      this.normalizeImageUrl(item?.featured_image?.url ?? item?.featured_image) ||
      this.normalizeImageUrl(item?.image?.url ?? item?.image?.src ?? item?.image) ||
      this.normalizeImageUrl(Array.isArray(item?.images) ? item.images[0] : undefined);
    const image_alt =
      (typeof item?.featured_image === 'object' && (item?.featured_image?.alt || item?.featured_image?.altText)) ||
      (typeof item?.image === 'object' && (item?.image?.alt || item?.image?.altText)) ||
      (Array.isArray(item?.images) && typeof item.images[0] === 'object' && (item.images[0]?.alt || item.images[0]?.altText)) ||
      title || '';
    const price =
      item?.price_min?.toString?.() ||
      item?.price?.toString?.() ||
      (Array.isArray(item?.variants) ? item.variants[0]?.price?.toString?.() : undefined);
    const price_formatted = price ? formatMoney(Number(price), state.currencyCode) : undefined;
    const normalized: Record<string, any> = {
      resource, url, id, handle, title, image, featured_image: image, image_alt, price, description,
      vendor, author, published_at, product_type,
      tags: item?.tags || [],
      currency: getCurrencySymbol(state.currencyCode),
      price_formatted,
    };

    const requested = this.parseRequestedFields();
    const renderable = requested
      .map(f => (f === 'type' ? 'product_type' : f))
      .filter(Boolean);
    if(!renderable.includes('resource')) renderable.push('resource');
    if(!renderable.includes('url')) renderable.push('url');

    const result: any = {};
    for(const key of renderable) {
      if(normalized[key] !== undefined && normalized[key] !== null && normalized[key] !== '') {
        result[key] = normalized[key];
      };
    };
    if(normalized.image_alt) result.image_alt = normalized.image_alt;
    if(normalized.price) {
      result.price_formatted = normalized.price_formatted ?? formatMoney(Number(normalized.price), state.currencyCode);
      if(normalized.currency) result.currency = normalized.currency;
    };
    return result;
  };

  private handleSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value || '';
    this.searchTerm = value;
    if(this.querybuttontext) return;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.fetchPredictive(value);
    }, this.debounce);  
  };

  private handleSearchSubmit = (event: Event) => {
    event.preventDefault();
    this.fetchPredictive(this.searchTerm);
  };

  private renderResults(groupBy: string) {
    if(!this.searchTerm || this.searchTerm.length < this.minchars) return null;
    return (
      <>
      <div class="results-group-title">
        <span class="tertiary-title">{groupBy}</span>
      </div>
      <ul id={this.resultsListId} class={`${BLOCK}-prediction-list`} role="listbox">
        {this.searchReturnData.map((result, idx) => (
          result.resource === groupBy && result.url && (
            <li key={idx} class={`${BLOCK}-prediction-item`} role="option">
              <a class={`${BLOCK}-prediction-link`} href={result.url}>
                {this.parseRequestedFields()
                  .filter(f => f !== 'resource' && f !== 'url')
                  .filter(field => field === 'image' || field === 'featured_image')
                  .map((field, fIdx) => {
                    const val = result[field];
                    if(val === undefined || val === null || val === '') return null;
                    return <img key={fIdx} class="prediction-image" src={val} alt={result.image_alt || result.title || ''} />;
                  })
                }
                <div class={`${BLOCK}-prediction-details`}>
                  {this.parseRequestedFields()
                    .filter(f => f !== 'resource' && f !== 'url')
                    .filter(field => field !== 'image' && field !== 'featured_image')
                    .map((field, fIdx) => {
                      const key = field === 'type' ? 'product_type' : field;
                      const val = result[key];
                      if(val === undefined || val === null || val === '') return null;
                      if(key === 'price') {
                        const display = result.price_formatted ?? formatMoney(Number(val), state.currencyCode);
                        return <span key={fIdx} class={`prediction-part prediction-${key}-span`}>{display}</span>;
                      }
                      return <span key={fIdx} class={`prediction-part prediction-${key}-span`}>{val}</span>;
                    })
                  }
                </div>
              </a>
            </li>
          )
        ))}
      </ul>
      </>
    );
  };

  render() {
    const hasResults = this.hasRenderableResults;
    const base = this.normalizeAction(this.action);
    const seeAllHref = `${base}?type=product&q=${encodeURIComponent(this.searchTerm || '')}`;
    const shouldShowPanel = !!this.searchTerm && this.searchTerm.length >= this.minchars;
    return (
      <form
        class={`${BLOCK}${this.expandable ? ' expandable' : ''}`}
        action={this.action} 
        method="get" 
        role="search"
        onSubmit={this.handleSearchSubmit}>
          <div class={`${BLOCK}-wrapper ${this.labelposition ? `label-${this.labelposition}` : ''}`}>
          {this.searchlabel && (
            <label class={`${BLOCK}-label`} htmlFor="Search">{this.searchlabel}</label>
          )}
            <input
              id="Search"
              class={`${BLOCK}-input`}
              type="search"
              name="q"
              value={this.searchTerm}
              onInput={this.handleSearchInput}
              role="combobox"
              aria-expanded={hasResults ? 'true' : 'false'}
              aria-owns={this.resultsListId}
              aria-controls={this.resultsListId}
              aria-haspopup="listbox"
              aria-autocomplete="list" 
              placeholder={this.placeholder}/>
              {this.querybuttontext && (
                <iv-button classmodifier={`${BLOCK}-submit`} type="submit">
                  <span class="inner-button" innerHTML={this.querybuttontext}></span>
                </iv-button>
              )}
              {this.clearbutton && (
                <iv-button classmodifier={`${BLOCK}-clear`} type="button" onClick={() => {
                  this.searchTerm = '';
                  this.searchReturnData = [];
                  this.noResults = false;
                  this.searchTermsChanged.emit('');
                }}>
                  <span class="inner-button" innerHTML={this.clearbutton}></span>
                </iv-button>
              )}
          </div>
          {this.showspinner && <iv-spinner show={this.showspinner && state.loading} />}
          <div class={`${BLOCK}-results`}>
          {shouldShowPanel && (
            this.searchReturnData.length > 0 ? (
              this.useGridLayout ? (
                <iv-layout 
                  gridTemplateAreas={this.gridTemplateAreas}
                  classModifier={BLOCK}>
                    {this.gridAreaNames.map(resource => (
                      <div slot={resource}>
                        {this.renderResults(resource)}
                      </div>
                    ))}
                  </iv-layout>
              ) : (
                <iv-tabs
                  classModifier={BLOCK}
                  labels={this.tabLabels}
                  tabLayout={this.tablayout as 'horizontal' | 'vertical'}>
                    {this.tabLabels.map((label:string, index) => (
                      <div slot={`tab-content-${index}`}>
                        {this.renderResults(label)}
                      </div> 
                    ))}
                </iv-tabs>
              )
            ) : this.noResults && !state.loading ? (
              <div class={`${BLOCK}-no-results`}>
                <p>{this.noresultstext}</p>
              </div>
            ) : null
          )}
          </div>
          {this.showallbuttontext && hasResults && (
          <div class={`${BLOCK}-see-all`}>
            <a class="btn btn-link" href={seeAllHref}>{this.showallbuttontext}</a>
          </div>
          )}
      </form>

    );

  };
  
};

/* TO DO 
I reckon this code can be simmplified, because we now pass resoruce types, so we no longer need to build them from gridlayout
*/