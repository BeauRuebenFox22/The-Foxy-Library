import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'iv-newsletter',
  styleUrl: 'iv-newsletter.scss',
  shadow: true,
})
export class IvNewsletter {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
