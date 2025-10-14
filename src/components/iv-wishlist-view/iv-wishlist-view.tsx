import { Component, h } from '@stencil/core';
import { state, removeFromWishlist } from '../../utils/store/store';
import { getProductIDFromGid } from '../../utils/helpers/factory';
import { addToCart } from '../../utils/storefront_api/factory';

const BLOCK = 'iv-wishlist-view';

@Component({
  tag: 'iv-wishlist-view',
  styleUrl: 'iv-wishlist-view.scss',
  shadow: false
})

export class IvWishlistView {

  render() {

    return (
      
      <div class={BLOCK}>
        <ul class={`${BLOCK}-list`}>
          {state.wishlist.length === 0 ? (
            <li class={`${BLOCK}-empty`}>{state.wishlistLabels.emptyMessage}</li>
          ) : (
            state.wishlist.map((item, idx) => (
              <li class={`${BLOCK}-item`} key={item.id || idx}>
                <div class={`${BLOCK}-fields`}>
                  {Object.entries(item).map(([key, value]) => (
                    <div class={`${BLOCK}-field ${BLOCK}-field-${key}`}>{value}</div>
                  ))}
                </div>
                <div class={`${BLOCK}-actions`}>
                  <iv-button
                    classmodifier={`${BLOCK}-remove`}
                    onClick={() => removeFromWishlist(item.id)}>
                      <span class="inner-button" innerHTML={state.wishlistLabels.removeLabel}></span>
                  </iv-button>
                  <iv-button
                    classmodifier={`${BLOCK}-add-to-cart`}
                    onClick={() => addToCart({ id: getProductIDFromGid(item.id) })}> 
                      {/* the getProductID() above may not be needed, can't remember the format here. */}
                      <span class="inner-button" innerHTML={state.wishlistLabels.addToCartLabel}></span>
                  </iv-button>
                </div>
              </li>
              ))
            )}
        </ul>
      </div>
      
    );

  };

};