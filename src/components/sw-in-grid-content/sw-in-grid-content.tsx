import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sw-in-grid-content',
  styleUrl: 'sw-in-grid-content.scss',
  shadow: false,
})
export class SwInGridContent {

  render() {
  
    return (
      <Host>
        <div class="promo-card dark-infill">
          <slot name="media"></slot>
          <slot name="text"></slot>
        </div>
      </Host>
    );

  };

};