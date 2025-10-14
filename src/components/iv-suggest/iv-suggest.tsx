import { Component, h, Prop } from '@stencil/core';
import { decodeJsonString } from '../../utils/helpers/factory';

const BLOCK = 'iv-suggest';

@Component({
  tag: 'iv-suggest',
  styleUrl: 'iv-suggest.scss',
  shadow: false,
})

export class IvSuggest {
 
  @Prop() topqueries?: string;
  @Prop() collections?: string;
  @Prop() products?: string;
  @Prop() banner?: string; 
  @Prop() bannerurl?: string;
  @Prop() bannertitle?: string;
  @Prop() bannertitletag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' = 'span';
  @Prop() bannerbuttontext?: string;
  @Prop() topquerytitle?: string;
  @Prop() productstitle?: string;
  @Prop() collectionstitle?: string;
  @Prop() gridlayout?: string;
  @Prop() requestfields?: string;

  private get suggestionElements(): string[] {
    return [
      this.topqueries && 'queries',
      this.collections && 'collections',
      this.products && 'products',
      this.banner && 'banner',
    ].filter(Boolean) as string[];
  };

  private renderQueries() {
    const queries = Array.from(new Set((this.topqueries || '').split(',').map(q => q.trim()).filter(Boolean)));
    return (
      <div class={`${BLOCK}-top-queries`}>
        {this.topquerytitle && <span class={`${BLOCK}-top-queries-title`}>{this.topquerytitle}</span>}
        {queries.map(query => (
          <iv-link 
            classmodifier={BLOCK}
            linkhref={`/search?q=${encodeURIComponent(query)}`}>
            {query}
          </iv-link>
        ))}
      </div>
    );
  };

  private renderTiles(type: string) {
    let raw = type === 'collections' ? this.collections : this.products;
    let decoded = decodeJsonString(raw || '[]');
    let data: any[];
    try {
      data = JSON.parse(decoded);
    } catch {
      data = [];
    };
    return (
      <div class={`${BLOCK}-${type}`}>
        {(type === 'products' && this.productstitle) || (type === 'collections' && this.collectionstitle) ? (
          <span class={`${BLOCK}-${type}-title`}>
            {type === 'products' ? this.productstitle : this.collectionstitle}
          </span>
        ) : null}
        {data.length === 0 ? (
          <span class={`${BLOCK}-no-data`}>No {type} found.</span>
        ) : (
          data.map(collection => (
            <iv-card 
              data={collection} 
              classmodifier={BLOCK}
              {...(this.requestfields ? { fields: this.requestfields } : {})}/>
          ))
        )}
      </div>
    );
  };

  private renderBanner() {
    const Tag = this.bannertitletag as any;
    return (
      <iv-banner 
        classmodifier={BLOCK}
        bannerurl={this.bannerurl || ''}
        bannerbuttontext={this.bannerbuttontext || ''}>
        {this.banner && (
          <div class={`${BLOCK}-banner-image`} slot="bannerimage">
            <img 
              src={this.banner || ''} 
              alt="Promotional banner"/>
          </div>
        )}
        {this.bannertitle && (
        <div slot="bannertitle">
          <Tag class="iv-banner-title">{this.bannertitle}</Tag>
        </div>
        )}
        {this.bannerbuttontext && (
          <div slot="bannerbutton">
            <a href={this.bannerurl || ''} class="iv-button iv-button--primary">
              {this.bannerbuttontext}
            </a>
          </div>
        )}
      </iv-banner>
    );
  };

  private renderers = {
    queries: () => this.renderQueries(),
    collections: () => this.renderTiles('collections'),
    products: () => this.renderTiles('products'),
    banner: () => this.renderBanner()
  };

  render() {

    return (
      <div class={BLOCK}>
        {this.gridlayout && (
          <iv-layout
            gridTemplateAreas={this.gridlayout}
            classModifier={BLOCK}>
              {this.suggestionElements.map(slot => (
                <div slot={slot}>
                  {this.renderers[slot]?.()}
                </div>
              ))}
          </iv-layout>
        )}
      </div>

    );
  };

};