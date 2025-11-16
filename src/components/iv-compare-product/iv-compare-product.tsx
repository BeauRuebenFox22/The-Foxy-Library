import { Component, h } from '@stencil/core';

const BLOCK = 'iv-compare-product';

@Component({
  tag: 'iv-compare-product',
  styleUrl: 'iv-compare-product.scss',
  shadow: false
})

// Caching to reduce netowork requests when comparing products
// Check chched strucutre for any product already cached, if it's already there, load the group it was cached with
// This could break if the same product is in more than one group
// Use an active state to hight light the current product being viewed

/* Bonus features
“Add to Cart” or “View Details” buttons per product
Feature tooltips or info icons
Option to export/share comparison
*/

export class IvCompareProduct {

  render() {

    return (

      <div class={BLOCK}>

      </div>

    );

  };

};

// OTHER COMPONENTS TO BUILD:
// Quick view
// Coplimentary products
// Focus modal