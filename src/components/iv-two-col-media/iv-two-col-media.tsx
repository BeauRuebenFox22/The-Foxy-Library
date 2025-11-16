import { Component, Prop, h, State } from '@stencil/core';
import { classNames } from '../../utils/helpers/factory';

const BLOCK = 'iv-two-col-media';

@Component({
  tag: 'iv-two-col-media',
  styleUrl: 'iv-two-col-media.scss',
  shadow: false
})

export class IvTwoColMedia {

  @Prop() mobilebehaviour: 'stack' | 'hide_specific' | 'hide_both';
  @Prop() whichcolumn?: 'col-1' | 'col-2';
  @Prop() stackorder?: 'col-1' | 'col-2';
  @Prop() verticalalign: 'top' | 'middle' | 'bottom';
  @Prop() horizontalalign: 'left' | 'center' | 'right';
  @Prop() gap: string;

  @State() hasMediaCol1: boolean = false;
  @State() hasMediaCol2: boolean = false;

  private leftSlotRef: HTMLSlotElement;
  private rightSlotRef: HTMLSlotElement;


  private get hideForMobile(): boolean {
    return this.mobilebehaviour === 'hide_both';
  };

  componentDidLoad() {
    const leftSlot = this.leftSlotRef;
    const rightSlot = this.rightSlotRef;
    this.hasMediaCol1 = leftSlot?.assignedElements().some(el => el.tagName === 'IMG' || el.querySelector('img'));
    this.hasMediaCol2 = rightSlot?.assignedElements().some(el => el.tagName === 'IMG' || el.querySelector('img'));
  };

  render() {

    return (

      <section 
        class={classNames(BLOCK, this.hideForMobile && 'hide-for-mobile')} 
        style={{ gap: this.gap }}>
        <div 
          class={classNames(
            BLOCK, 
            this?.whichcolumn === 'col-1' && 'hide-column',
            this.hasMediaCol1 && 'has-media',
            this.stackorder === 'col-1' ? 'order-1' : 'order-2',
            `vertical-align-${this.verticalalign}`, 
            `horizontal-align-${this.horizontalalign}`
          )}>
            <div class="layout-stabilizer">
              <slot name='col-1' ref={el => (this.leftSlotRef = el as HTMLSlotElement)}></slot>
            </div>
        </div>
        <div class={classNames(
          BLOCK, 
          this?.whichcolumn === 'col-2' && 'hide-column',
          this.hasMediaCol2 && 'has-media',
          this.stackorder === 'col-2' ? 'order-1' : 'order-2',
          `vertical-align-${this.verticalalign}`, 
          `horizontal-align-${this.horizontalalign}`
        )}>
          <div class="layout-stabilizer">
            <slot name='col-2' ref={el => (this.rightSlotRef = el as HTMLSlotElement)}></slot>
          </div>
        </div>
      </section>

    );

  };

};