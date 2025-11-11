import { Component, h, Prop, Event, EventEmitter, Element } from '@stencil/core';

const BLOCK = 'iv-event-button';

@Component({
  tag: 'iv-event-button',
  styleUrl: 'iv-event-button.scss',
  shadow: false
})

export class IvEventButton {

  @Prop() eventname: string;
  @Prop() eventdetail: any;
  @Prop() buttontext: string = 'Click Me';

  @Element() host: HTMLElement;
  @Event() action: EventEmitter<any>;

  private handleClick = () => {
    this.action.emit({
      eventname: this.eventname,
      eventdetail: this.eventdetail
    });
    if(this.eventname) {
      const customEvent = new CustomEvent(this.eventname, {
        bubbles: true,
        composed: true,
        detail: { content: this.eventdetail }
      });
      this.host.dispatchEvent(customEvent);
    };
  };
  
  render() {
  
    return (

      <button class={BLOCK} onClick={this.handleClick}>
        <span class={`${BLOCK}-text`}>
         <slot></slot> 
        </span>
      </button>

    );

  };

};