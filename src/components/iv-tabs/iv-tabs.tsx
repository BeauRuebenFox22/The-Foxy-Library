import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'iv-tabs',
  styleUrl: 'iv-tabs.scss',
  shadow: false,
})

export class IvTabs {

  @Prop() labels: string[] = [];
  @Prop() classModifier?: string;
  @Prop() tabLayout: 'horizontal' | 'vertical' = 'horizontal';

  @State() activeTab: number = 0;

  render() {

    return (
      <div class={`iv-tabs iv-tabs--${this.classModifier} iv-tabs--${this.tabLayout}`}>
        <div class="iv-tabs__header" role="tablist">
          {this.labels.map((label, index) => (
            <button
              id={`tab-button-${index}`}
              class={`iv-tab ${this.activeTab === index ? 'active' : ''}`}
              onClick={() => this.activeTab = index}
              aria-selected={this.activeTab === index ? 'true' : 'false'}
              aria-controls={`tab-panel-${index}`}
              role="tab"
              type="button"
              tabindex={this.activeTab === index ? '0' : '-1'}>
              {label}
            </button>
          ))}
        </div>
        <div class="iv-tabs__content">
          {this.labels.map((_, index) => (
            <div
              id={`tab-panel-${index}`}
              role='tabpanel'
              aria-labelledby={`tab-button-${index}`}
              hidden={this.activeTab !== index}>
                <slot name={`tab-content-${index}`}></slot>
            </div>
          ))}
        </div>
      </div>
    );

  };

};