import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'iv-banner',
  styleUrl: 'iv-banner.scss',
  shadow: false
})

export class IvBanner {

  @Prop() classmodifier?: string;
  @Prop() bannerurl?: string;
  @Prop() bannerbuttontext?: string;
  @Prop() bannertype: 'div' | 'section' | 'article' = 'div';

  render() {

    const Tag = this.bannertype as any;

    const content = [
      <slot name="bannerimage" />,
      <slot name="bannertitle" />,
      <slot name="bannerbutton" />
    ];

    return (
      <Tag class={`iv-banner ${this.classmodifier || ''}`}>
        {this.bannerurl && !this.bannerbuttontext ? (
          <a href={this.bannerurl} class="iv-banner-link" aria-label="Banner link">
            {content}
          </a>
        ) : (
          content
        )}
      </Tag>
    );

  };

};