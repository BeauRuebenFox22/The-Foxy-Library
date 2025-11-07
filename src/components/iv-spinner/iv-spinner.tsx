import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-spinner';

@Component({
  tag: 'iv-spinner',
  styleUrl: 'iv-spinner.scss',
  shadow: false
})

export class IvSpinner {

  @Prop() show: boolean = false;

  render() {

    return this.show ? (
      <div class={BLOCK} role="status" aria-live="polite" aria-busy="true">
        <span class={`${BLOCK}-circle`} aria-hidden="true"></span>
        <span class={`${BLOCK}-sr`}>Loading...</span>
      </div>
    ) : null;
  
  };

};