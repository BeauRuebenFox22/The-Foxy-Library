import { Component, h, Listen, State } from '@stencil/core';

const BLOCK = 'iv-sidebar';

@Component({
  tag: 'iv-sidebar',
  styleUrl: 'iv-sidebar.scss',
  shadow: false
})

export class IvSidebar {

  @State() sidebarState: boolean = false;
  @State() contentName: string;

  @Listen('openSidebar', { target: 'document' })
  handleopenSidebar(event: CustomEvent) {
    const { content } = event.detail;
    this.contentName = content;
    this.toggleSidebar();
  };

  private toggleSidebar() {
    this.sidebarState = !this.sidebarState;
  };

  render() {
    
    return [

      <div class={`${BLOCK} ${ this.sidebarState && 'open' }`} role="complementary" aria-labelledby="iv-sidebar-title">
        <iv-button class={`${BLOCK}-close`} aria-label="Close modal" onClick={() => this.toggleSidebar()}>&times;</iv-button>
        <slot name="header"></slot>
        {this.contentName === 'wishlist' ? (
          <iv-wishlist-view />
        ) : (
          this.contentName && <slot name={this.contentName}></slot>
        )}
        <slot name="footer"></slot>
      </div>,
      <div class={`${BLOCK}-overlay ${this.sidebarState && 'open'}`} onClick={() => this.toggleSidebar()}></div>

      ];

  };

};