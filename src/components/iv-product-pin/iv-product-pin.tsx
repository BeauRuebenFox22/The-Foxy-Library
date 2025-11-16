import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-product-pin';

@Component({
  tag: 'iv-product-pin',
  styleUrl: 'iv-product-pin.scss',
  shadow: false
})

export class IvProductPin {
  
  @Prop() pinProduct: string;
  @Prop() pinKey: number;
  @Prop() pinCords: { x: number, y: number };
  @Prop() pinBehaviour: 'modal' | 'link' | 'tooltip';

  // Emmit an event for the parnt component to handle different behaviours like modal, link or tooltip
  render() {

    return (
      <div 
        id={`product-pin-${this.pinKey}`}
        class={BLOCK}
        style={{ left: `${this.pinCords.x}%`, top: `${this.pinCords.y}%` }}>
        {this.pinProduct}
      </div>
    );

  };

};