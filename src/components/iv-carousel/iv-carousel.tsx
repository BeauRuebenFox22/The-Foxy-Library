import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'iv-carousel',
  styleUrl: 'iv-carousel.scss',
  shadow: true,
})
export class IvCarousel {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
