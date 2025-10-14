import { Component, Host, h, Prop, Listen } from '@stencil/core';
import { state, togglePullout } from '../../utils/store/store';

const BLOCK = 'iv-sidebar';

@Component({
  tag: 'iv-sidebar',
  styleUrl: 'iv-sidebar.scss',
  shadow: false,
})

export class IvSidebar {

  @Prop() closeicon: string = '×';

  @Listen('openPullout', { target: 'window' })
  handleOpenPullout(event: CustomEvent) {
    togglePullout(event.detail);
  };

  render() {
    
    return (
      <Host>
        <div class={`${BLOCK} ${ state.pulloutOpen ? 'open' : '' }`}>
          <iv-button class={`${BLOCK}-close-button`} onClick={() => togglePullout()}>
            <span class="inner-button close">{this.closeicon}</span>
          </iv-button>
          <slot name="header"></slot>
          {state.pulloutContent === 'wishlist' ? (
            <iv-wishlist-view />
          ) : (
            state.pulloutContent && <slot name={state.pulloutContent}></slot>
          )}
          <slot name="footer"></slot>
        </div>
        <div class={`${BLOCK}-overlay ${state.pulloutOpen ? 'open' : ''}`} onClick={() => togglePullout()}></div>
      </Host>
    );

  };

};