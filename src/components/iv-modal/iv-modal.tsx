import { Component, Host, h } from '@stencil/core';
import { state, toggleModal } from '../../utils/store/store';

const BLOCK = 'iv-modal';

@Component({
  tag: 'iv-modal',
  styleUrl: 'iv-modal.scss',
  shadow: true
})

export class IvModal {

  render() {

    return (
      <Host>
        {state.modalIsOpen && (
          <div class={`${BLOCK}-overlay`} role="dialog" aria-modal="true" aria-labelledby="iv-modal-title" aria-describedby={`${BLOCK}-content`} onClick={() => toggleModal()}>
            <div class={BLOCK} onClick={e => e.stopPropagation()}>
              <iv-button class={`${BLOCK}-close`} aria-label="Close modal" onClick={() => toggleModal()}>&times;</iv-button>
              {state.modalContent === 'wishlist' ? (
                <iv-wishlist-view />
              ) : (
                state.modalContent && <slot name={state.modalContent}></slot>
              )}
            </div>
          </div>
        )}
      </Host>
    );

  };

};