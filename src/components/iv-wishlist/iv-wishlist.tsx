import { Component, h, Prop } from '@stencil/core';
import { 
  state, toggleModal, togglePullout, 
  showToast, removeFromWishlist } from '../../utils/store/store';

const BLOCK = 'iv-wishlist';

@Component({
  tag: 'iv-wishlist',
  styleUrl: 'iv-wishlist.scss',
  shadow: false
})

export class IvWishlist {

  @Prop() buttonaddvalue: string = 'Add to wishlist';
  @Prop() buttonremovevalue: string = 'Remove from wishlist';
  @Prop() wishlistempty: string = 'Your wishlist is empty';
  @Prop() buttonaddtocartvalue: string = 'Add to cart';
  @Prop() viewwishlistvalue: string = 'View wishlist';
  @Prop() productdata: Record<string, any> | string = {};
  @Prop() usefields: string = 'id,title,price,image,url';
  @Prop() previewtype: 'modal' | 'pullout' = 'modal';

  // Lifecycle hooks
  componentWillLoad() {
    const stored = localStorage.getItem('wishlist');
    if(stored) state.wishlist = JSON.parse(stored);
    state.wishlistLabels = {
      removeLabel: this.buttonremovevalue,
      addToCartLabel: this.buttonaddtocartvalue,
      emptyMessage: this.wishlistempty
    };
  };

  // Getters
  private get itemFromWishlist() {
    return state.wishlist.some(item => item.id === this.productdata['id']) || state.wishlist.length > 0;
  };

  private get buttonLabel() {
    if(this.itemFromWishlist) return this.buttonremovevalue || this.buttonaddvalue;
    return this.buttonaddvalue;
  };
  
  private get requestedFields() {
    let requestedFields = this.usefields.split(',').map(field => field.trim());
    if(!requestedFields.includes('id')) requestedFields.push('id');
    if(!requestedFields.includes('title')) requestedFields.push('title');
    return requestedFields;
  };

  // Methods
  private addToWishlist() {
    state.loading = true;
    const product = {};
    this.requestedFields.forEach(field => {
      if(this.productdata.hasOwnProperty(field)) product[field] = this.productdata[field];
    });
    state.wishlist = [...state.wishlist, product];
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    state.loading = false;
    showToast(`${product['title']} added to wishlist`, 'success', 5000);
  };

  render() {

    return (

      <div class={`${BLOCK}`}>
        <iv-button 
          classmodifier={`${BLOCK}-add ${this.itemFromWishlist ? 'remove' : 'add'}`} 
          onClick={() => this.itemFromWishlist ? removeFromWishlist(this.productdata['id']) : this.addToWishlist()}>
          <span class="inner-button" innerHTML={this.buttonLabel}></span>
        </iv-button>
        {state.wishlist.length > 0 && (
          <iv-button 
            classmodifier={`${BLOCK}-view`} 
            onClick={() => this.previewtype === 'modal' ? toggleModal('wishlist') : togglePullout('wishlist')}>
            <span class="inner-button" innerHTML={this.viewwishlistvalue}></span>
          </iv-button> 
        )}
      </div>

    );

  };

};