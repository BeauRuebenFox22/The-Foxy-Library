import { Component, h, Prop, State } from '@stencil/core';
import { requestedFields } from '../../utils/helpers/factory';
import 'ionicons';

const BLOCK = 'iv-accordion';

@Component({
  tag: 'iv-accordion',
  styleUrl: 'iv-accordion.scss',
  shadow: false
})

export class IvAccordion {

  @Prop() labels: string;
  @Prop() allowmultiple?: boolean;
  @Prop() startopen?: boolean;
  @Prop() acordionlayout: 'vertical' | 'horizontal' = 'vertical';
  @Prop() contentplacement: 'below' | 'right' = 'right';
  @Prop() dropdownicon?: 'chevron-down-outline' | 'add-outline';

  @State() openPanels: number[] = [];

  componentWillLoad() {
    this.openPanels = this.startopen ? [0] : [];
  };

  private togglePanel(index: number) {
    if(this.allowmultiple) {
      this.openPanels = this.openPanels.includes(index)
        ? this.openPanels.filter(i => i !== index)
        : [...this.openPanels, index];
    } else {
      this.openPanels = this.openPanels.includes(index)
        ? []
        : [index];
    };
  };

  render() {

    return (

  <div class={`${BLOCK} layout-${this.acordionlayout} content-${this.contentplacement}`}>
        {requestedFields(this.labels).map((label, index) => (
          <div class="accordion-panel" key={index}>
            <button
              class={{
                'accordion-header': true,
                'open': this.openPanels.includes(index)
              }}
              onClick={() => this.togglePanel(index)}
              aria-expanded={this.openPanels.includes(index)}
              aria-controls={`panel-content-${index}`}
              id={`panel-header-${index}`}
              type="button">
                {label}
                {this.dropdownicon && <ion-icon class="accordion-icon" name={this.dropdownicon}></ion-icon>}
            </button>
            <div
              id={`panel-content-${index}`}
              class={{
                'accordion-content': true,
                'open': this.openPanels.includes(index)
              }}
              role="region"
              aria-labelledby={`panel-header-${index}`}
              hidden={!this.openPanels.includes(index)}>
              <slot name={`panel-${index}`}></slot>
            </div>
          </div>
        ))}
      </div>

    );

  };

};