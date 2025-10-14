import { Component, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { state } from '../../utils/store/store';

@Component({
  tag: 'iv-button',
  styleUrl: 'iv-button.scss',
  shadow: false
})

export class IvButton {

  @Prop() type: string = 'button';
  @Prop() classmodifier?: string;
  @Prop() eventname?: string;
  @Prop() eventdetail?: string;
  @Prop() buttonClick?: (e?: MouseEvent) => void;

  @Event() action: EventEmitter<any>;

  @Element() el: HTMLElement;

  handleClick = (e: MouseEvent) => {
    if(this.buttonClick) this.buttonClick(e);
    if(this.eventname) {
      const detail = this.eventdetail || undefined;
      this.el.dispatchEvent(new CustomEvent(this.eventname, {
        bubbles: true,
        detail,
        composed: true
      }));
      this.action.emit(detail);
    };
  };

  render() {

    return (
    
      <button
        class={`iv-button ${state.loading ? 'disabled' : undefined} ${this.classmodifier || ''}`}
        type={this.type}
        disabled={state.loading}
        onClick={this.handleClick}>
        <slot></slot>
      </button>

    );

  };

};