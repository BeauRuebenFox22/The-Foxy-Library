import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-spinner',
  styleUrl: 'iv-spinner.scss',
  shadow: false,
})

export class IvSpinner {

  @Prop() show: boolean = false;

  render() {
    return this.show ? (
      <div class="iv-spinner">
        <span class="spinner"></span>
      </div>
    ) : null;

  };

};