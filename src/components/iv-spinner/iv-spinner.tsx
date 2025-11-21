import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-spinner';

@Component({
  tag: 'iv-spinner',
  styleUrl: 'iv-spinner.scss',
  shadow: false
})

// Add a global loading state, that responds to something in global state
// When this is true, the spinner appears central with a complete screen overlay
// This is to handle things like API calls, route changes, etc.

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