import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-link';

@Component({
  tag: 'iv-link',
  styleUrl: 'iv-link.scss',
  shadow: false,
})

export class IvLink {

  @Prop() classmodifier?: string;
  @Prop() linktype: 'inline' | 'wrapper' | 'nav' | 'button' = 'inline'
  @Prop() linkhref?: string;
  @Prop() linktarget: '_self' | '_blank' | '_parent' | '_top' = '_self';
  @Prop() linkrel: string = 'noopener noreferrer';
  @Prop() linkariaLabel?: string;

  render() {
    
    return (
      <a
        class={`${BLOCK} ${this.classmodifier || undefined} ${this.linktype}`}
        href={this.linkhref}
        target={this.linktarget}
        rel={this.linkrel}
        aria-label={this.linkariaLabel}>
        <slot></slot>
      </a>
    );

  };

};