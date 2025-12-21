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
      this.openPanels = this.openPanels.includes(index) ? [] : [index];
    };
  };

  render() {
    const labels = requestedFields(this.labels);

    return (

      <div class={`${BLOCK} layout-${this.acordionlayout} content-${this.contentplacement}`}>
        {labels?.map((label, index) => {
          const panelNumber = index + 1;
          const isOpen = this.openPanels.includes(index);
          
          return (
            <div class="accordion-panel" key={index}>
              <button
                class={{
                  'accordion-header': true,
                  'open': isOpen
                }}
                onClick={() => this.togglePanel(index)}
                aria-expanded={isOpen}
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
                  'open': isOpen
                }}
                role="region"
                aria-labelledby={`panel-header-${index}`}
                style={{ display: isOpen ? 'block' : 'none' }}>
                <slot name={`panel-${panelNumber}`}></slot>
              </div>
            </div>
          );
        })}
      </div>

    );

  };

};