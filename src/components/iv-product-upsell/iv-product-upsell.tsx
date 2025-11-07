import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'iv-product-upsell',
  styleUrl: 'iv-product-upsell.scss',
  shadow: true,
})
export class IvProductUpsell {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
