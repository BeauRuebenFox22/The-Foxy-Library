import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-pill';

@Component({
  tag: 'iv-pill',
  styleUrl: 'iv-pill.scss',
  shadow: false
})

export class IvPill {

  @Prop() label?: string;
  @Prop() content: string;
  @Prop() bordered: boolean = true;
  @Prop() internalspacing: 'small' | 'medium' | 'large' = 'medium';
  @Prop() externalspacing: 'none' | 'small' | 'medium' | 'large' = 'none';
  @Prop() roundedcorners: 'none' | 'small' | 'medium' | 'large' = 'medium';

  render() {

    return (
      <div class={
        BLOCK 
        + (this.bordered ? ' bordered' : '')
        + ` internal-${this.internalspacing}`
        + ` external-${this.externalspacing}`
        + ` corners-${this.roundedcorners}`
        }>
        <p class={`${BLOCK}-content`}>
          {this.label && 
            <span class={`${BLOCK}-label`}>{this.label}</span>
          }
          {this.content}
        </p>
      </div>
    );

  };

};