import { Component, h, Prop } from '@stencil/core';
import { state } from '../../utils/store/store';
import { formatMoney, getProductIDFromGid, requestedFields } from '../../utils/helpers/factory';
import { addToCart } from '../../utils/storefront_api/factory';

const BLOCK = 'iv-card';
const HIDDEN_FIELDS = new Set([
  'id',
  'handle',
  'url',
  'productUrl',
  'imageUrl',
  'imageAlt',
  'variantId',
  'images'
]);

@Component({
  tag: 'iv-card',
  styleUrl: 'iv-card.scss',
  shadow: false
})

export class IvCard {
  @Prop() data: Record<string, any>;
  @Prop() fields?: string;
  @Prop() cardtype?: string; 
  @Prop() classmodifier?: string;
  @Prop() buttontext?: string;
  @Prop() calltoaction: boolean = false;
  @Prop() addtocarttext?: string;

  private allowedFields: string[] | null = null;

  componentWillLoad() {
    if(this.fields) this.allowedFields = requestedFields(this.fields);
  };

  private generateImage(url: string, alt: string) {
    return (<img src={url} alt={alt || 'Product image'} class={`${BLOCK}-image`}/>);
  };

  private appendAddToCartButton(gid: string, quantity: number){
    const id: number = getProductIDFromGid(gid);
    return (
      <iv-button 
        classmodifier={`${BLOCK}-add-to-cart-btn`} 
        onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); addToCart({id, quantity}); }}>
        <span class="inner-button" innerHTML={this.addtocarttext}></span>
      </iv-button>
    );
  };

  private buildProductHref(): string | null {
    const handle = this.data?.handle;
    if(!handle) return null;
    const base = this.cardtype || 'products';
    return `/${base}/${handle}`.replace(/\\+/g,'/');
  };

  render() {
    let entries: [string, any][] = this.data ? Object.entries(this.data) : [];
    if(this.allowedFields && this.allowedFields.length > 0) entries = entries.filter(([key]) => this.allowedFields.includes(key));
    const imageUrl = this.data?.imageUrl;
    const imageAlt = this.data?.imageAlt;
    const wantsImage = !this.allowedFields || this.allowedFields.includes('imageUrl') || this.allowedFields.includes('images');
    const showImage = wantsImage && !!imageUrl;
    const href = this.buildProductHref();
    const content = [
      showImage ? this.generateImage(imageUrl, imageAlt) : null,
      ...entries.map(([key, value]) => {
        if(HIDDEN_FIELDS.has(key)) return null; // suppress structural fields
        if(value === undefined || value === null || value === '') return null;
        return (
          <span key={key} class={`${BLOCK}-field ${BLOCK}-${key}`}>
            {key.includes('price') ? formatMoney(value, state.currencyCode) : value}
          </span>
        );
      })
    ];

    if(this.calltoaction && href) {
      return (
        <div class={`${BLOCK} ${this.classmodifier || ''}`.trim()}>
          <iv-link 
            classmodifier={`${BLOCK}-link-wrapper`} 
            linktype='wrapper'
            linkhref={href}>
            {content}
          </iv-link>
          <div class={`${BLOCK}-controls`}>
            {this.buttontext && (
              <iv-link 
                linktype='button'
                classmodifier={`${BLOCK}-cta-btn`} 
                linkhref={href}>
                {this.buttontext}
              </iv-link>
            )}
            {this.addtocarttext && this.data?.variantId && this.appendAddToCartButton(this.data.variantId, 1)}
          </div>
        </div>
      );
    }

    return (
      <div class={`${BLOCK} ${this.classmodifier || ''}`.trim()}>
        {content}
        <div class={`${BLOCK}-controls`}>
          {this.buttontext && href && (
            <iv-link 
              linktype='button'
              classmodifier={`${BLOCK}-cta-btn`} 
              linkhref={href}>
              {this.buttontext}
            </iv-link>
          )}
          {this.addtocarttext && this.data?.variantId && this.appendAddToCartButton(this.data.variantId, 1)}
        </div>
      </div>
    );

  };

};