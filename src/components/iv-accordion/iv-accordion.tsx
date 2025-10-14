import { Component, h, Prop, State } from '@stencil/core';

const BLOCK = 'iv-accordion'

@Component({
  tag: 'iv-accordion',
  styleUrl: 'iv-accordion.scss',
  shadow: false
})

export class IvAccordion {

  @Prop() classmodifier?: string;
  @Prop() accordiontype: 'div' | 'section' | 'article' = 'div';
  @Prop() accordionlabels: string;
  @Prop() showmultiple: boolean = false;
  @Prop() showfirst: boolean = false;
  @Prop() startingpanel: number = 0;
  @Prop() layout: 'vertical' | 'horizontal' = 'horizontal';

  @State() activePanel: string;

  private interimLabels(): string [] {
    let labelsArray = [];
    this.accordionlabels.split(',').forEach(label => {
      labelsArray.push(label.trim());
    });
    return labelsArray;
  };

  render() {

    return (
      <div class={BLOCK}>

        <div class={`${BLOCK}-labels`}>
          {this.accordionlabels && this.interimLabels().map((label: string, index: number) => (
            <button
              onClick={() => this.activePanel = `panel-${index}`}>
              {label}
            </button>
          ))}
        </div>

        <div class={`${BLOCK}-content-panel`}>
          <slot name={this.activePanel}></slot>
        </div>

      </div>
    );

  };

};