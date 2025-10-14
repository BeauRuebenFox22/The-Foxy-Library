import { Component, h, Prop, State } from '@stencil/core';
import { getIdFromHandle, fetchProductByID } from '../../utils/storefront_api/factory';
import { getProductHandle } from '../../utils/helpers/factory';

const BLOCK = 'iv-recently-viewed';
const STORAGE_KEY = 'iv:recentlyViewed';

@Component({
  tag: 'iv-recently-viewed',
  styleUrl: 'iv-recently-viewed.scss',
  shadow: false
})

export class IvRecentlyViewed {

  @Prop() componenttitle?: string;
  @Prop() titletag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' = 'span';
  @Prop() numbertoshow: number = 4;
  @Prop() noviewhistory?: string;
  @Prop() requestedfields?: string = 'images,title,price';

  @State() items: any[] = [];

  private currentProductId: string | null = null;
  private historyAvailable: boolean;

  async componentWillLoad() {
    await this.trackCurrentProduct();
    await this.loadForRender();
    this.items.length > 0 ? this.historyAvailable = true : this.historyAvailable = false;
  };

  private safeParse(json: string | null): Record<string, any> | null {
    if(!json) return null;
    try { 
      return JSON.parse(json); } 
    catch { 
      return null; 
    };
  };

  private loadStorage(): Record<string, any> {
    if(typeof window === 'undefined') return {};
    return this.safeParse(localStorage.getItem(STORAGE_KEY)) || {};
  };

  private saveStorage(obj: Record<string, any>) {
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); 
    } 
    catch(e) { 
      console.warn('Unable to persist recently viewed', e); 
    };
  };

  private async trackCurrentProduct() {
    const handle = getProductHandle();
    if(!handle) return;
    const productId = await getIdFromHandle(handle);
    if(!productId) return;
    this.currentProductId = productId;
    const storeObj = this.loadStorage();
    if(storeObj[productId]) return; 
    try {
      const fields = this.requestedfields;
      const product = await fetchProductByID(productId, fields);
      if(!product) return;
      storeObj[productId] = product;
      this.saveStorage(storeObj);
    } catch (e) {
      console.warn('Failed to fetch/store recently viewed product', e);
    };
  };

  private async loadForRender() {
    const storeObj = this.loadStorage();
    const values = Object.values(storeObj) as any[];
    const filtered = this.currentProductId ? values.filter(p => p.id !== this.currentProductId) : values;
    const ordered = [...filtered].reverse();
    this.items = ordered.slice(0, this.numbertoshow);
  };

  render() {
    const TAG = this.titletag as any;
    return (
      <div class={BLOCK}>
        {this.historyAvailable ? [
          this.componenttitle && <TAG class={`${BLOCK}-title`}>{this.componenttitle}</TAG>,
          <iv-layout classModifier={BLOCK}>
            {this.items.map(item => (
              <iv-card
                data={item}
                fields={this.requestedfields}
                classmodifier={BLOCK}
                calltoaction
                addtocarttext="Add to cart"
                cardtype="products">
              </iv-card>
            ))}
          </iv-layout>
        ] : (
          this.noviewhistory ? <div class={`${BLOCK}-no-history`}>{this.noviewhistory}</div> : null
        )}
      </div>
    );

  };

};