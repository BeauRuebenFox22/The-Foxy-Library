import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-toast';

@Component({
  tag: 'iv-toast',
  styleUrl: 'iv-toast.scss',
  shadow: false
})

export class IvToast {

  @Prop() message: string;
  @Prop() toastId: number;
  @Prop() duration: number = 3000;
  @Prop() type: 'info' | 'success' | 'error' | 'warning' = 'info';

  render() {

    return (

      <div class={`${BLOCK} ${this.type}`} role="alert" aria-live="assertive" aria-atomic="true">
        <span class={`${BLOCK}-message`}>
          {this.message}
        </span>
      </div>
      
    );

  };

};