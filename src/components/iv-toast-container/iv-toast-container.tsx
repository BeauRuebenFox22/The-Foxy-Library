import { Component, h, State } from '@stencil/core';
import { state, onStoreChange, ToastItem } from '../../utils/store/store';

const BLOCK = 'iv-toast-container';

@Component({
  tag: 'iv-toast-container',
  styleUrl: 'iv-toast-container.scss',
  shadow: false,
})
export class IvToastContainer {
  @State() _bump: number = 0; // force re-render marker

  private unsub?: () => void;

  private onToastEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail as ToastItem;
    if(!detail || typeof detail.id === 'undefined') return;
    if(!state.toasts.some(t => t.id === detail.id)) {
      console.debug('[iv-toast-container] consumed iv:toast event', { receivedId: detail.id, storeInstance: state._instanceId });
      state.toasts = [...state.toasts, detail];
      setTimeout(() => { state.toasts = state.toasts.filter(t => t.id !== detail.id); }, detail.duration || 3000);
    }
  };

  connectedCallback() {
    document.addEventListener('iv:toast', this.onToastEvent as any);
    // Explicit subscription (defensive) – bump state when toasts array mutates
    try {
      this.unsub = onStoreChange('toasts', () => { this._bump++; console.debug('[iv-toast-container] onStoreChange bump', this._bump, 'length=', state.toasts.length); });
    } catch(e) { console.warn('[iv-toast-container] onStoreChange not available', e); }
    console.debug('[iv-toast-container] connected storeInstance=', state._instanceId);
  }

  disconnectedCallback() {
    document.removeEventListener('iv:toast', this.onToastEvent as any);
    this.unsub && this.unsub();
  }

  render() {
    return (
      <div class={BLOCK} data-bump={this._bump}>
        {state.toasts.map(t => (
          <iv-toast
            key={t.id}
            toastId={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
          />
        ))}
      </div>
    );
  }
}