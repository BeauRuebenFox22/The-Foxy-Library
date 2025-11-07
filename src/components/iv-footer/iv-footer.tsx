import { Component, h, Element, State, Prop } from '@stencil/core';

const BLOCK = 'iv-footer';

@Component({
  tag: 'iv-footer',
  styleUrl: 'iv-footer.scss',
  shadow: false
})

export class IvFooter {

  @Prop() gridtemplateareas: string;

  @Element() host: HTMLElement;
  
  @State() blockElements: HTMLElement[] = [];
  
  // private footerEl?: HTMLElement;

  // componentDidLoad() {
  //   if(this.footerEl) {
  //     const children = Array.from(this.footerEl.children)
  //       .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SLOT');
  //     this.blockElements = children as HTMLElement[];
  //   };
  // };

  private get getAreas(): boolean {
    return !!this.gridtemplateareas;
  };

  private get test(): string {
    return this.getAreas
    ? this.gridtemplateareas.split(',').map(row => `"${row.trim()}"`).join(' ')
    : '';
  };

  render() {

    return (
      <footer 
        class={BLOCK} 
        // ref={el => (this.footerEl = el as HTMLElement)}
        style={{ gridTemplateAreas: this.test }}>
        <slot></slot>
      </footer>
    );
  };

};

// Commente out code is not currently used, though it may have future utilities
// The two getters should move to global helper functions