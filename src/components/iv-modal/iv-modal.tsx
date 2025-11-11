import { Component, Host, h, Listen, State, Prop  } from '@stencil/core';
import {
  NewsletterTimerState, NewsletterTimerOptions, createNewsletterTimerState,
  startNewsletterTimer, pauseNewsletterTimer, resumeNewsletterTimer, hasNewsletterPopupShown
} from '../../utils/shared/newsletter-timer';

const BLOCK = 'iv-modal';

@Component({
  tag: 'iv-modal',
  styleUrl: 'iv-modal.scss',
  shadow: false
})

export class IvModal {

  @Prop() newsletterpopuptrigger?: NewsletterTimerOptions['newsletterpopuptrigger'];
  @Prop() newsletterpopuptimedelay?: NewsletterTimerOptions['newsletterpopuptimedelay'];
  @Prop() newsletterpopuptitle?: NewsletterTimerOptions['newsletterpopuptitle'];
  @Prop() newsletterpopuptext?: NewsletterTimerOptions['newsletterpopuptext'];
  @Prop() newsletterpopupimage?: NewsletterTimerOptions['newsletterpopupimage'];
  @Prop() newsletterpopupdisclaimer?: NewsletterTimerOptions['newsletterpopupdisclaimer'];

  @State() modalState: boolean = false;
  @State() contentName: string;

  private newsletterTimerState: NewsletterTimerState = createNewsletterTimerState();

  @Listen('openModal', { target: 'document' })
  handleOpenModal(event: CustomEvent) {
    pauseNewsletterTimer(this.newsletterTimerState);
    const { content } = event.detail;
    this.contentName = content;
    this.toggleModal();
  };

  componentWillLoad() {
    const delay = Number(this.newsletterpopuptimedelay) || 0;
    if(
      this.newsletterpopuptrigger === 'time_delay' && 
      delay > 0 && 
      !hasNewsletterPopupShown()) {
        startNewsletterTimer(
          this.newsletterTimerState,
          delay,
          () => {
            this.contentName = 'newsletter';
            this.toggleModal();
          }
        );
      };
      if(this.newsletterpopuptrigger === 'exit_intent' && 
        !hasNewsletterPopupShown()
      ) {
        document.addEventListener('mouseout', this.handleExitIntent);
      };
  };
    
  private handleExitIntent = (event: MouseEvent) => {
    if(event.clientY <= 0 && !hasNewsletterPopupShown()){
      if(this.modalState && this.contentName !== 'newsletter') {
        this.toggleModal();
        setTimeout(() => {
          this.contentName = 'newsletter';
          this.toggleModal();
          sessionStorage.setItem('newsletterPopupShown', 'true');
        }, 300)
      } else {
        this.contentName = 'newsletter';
        this.toggleModal();
        sessionStorage.setItem('newsletterPopupShown', 'true');
      };
      document.removeEventListener('mouseout', this.handleExitIntent);
    };
  };

  private toggleModal() {
    this.modalState = !this.modalState;
    if(!this.modalState) {
      pauseNewsletterTimer(this.newsletterTimerState);
      if(
        this.contentName !== 'newsletter' &&
        this.newsletterTimerState.newsletterTimerRemaining > 0 &&
        !hasNewsletterPopupShown()
      ) {
        resumeNewsletterTimer(
          this.newsletterTimerState,
          () => {
            this.contentName = 'newsletter';
            this.toggleModal();
          }
        );
      };
    };
  };

  render() {

    return (
      <Host>
        {this.modalState && (
          <div class={`${BLOCK}-overlay`} role="dialog" aria-modal="true" aria-labelledby="iv-modal-title" aria-describedby={`${BLOCK}-content`} onClick={() => this.toggleModal()}>
            <div class={BLOCK} onClick={e => e.stopPropagation()}>
              <iv-button class={`${BLOCK}-close`} aria-label="Close modal" onClick={() => this.toggleModal()}>&times;</iv-button>
              {this.contentName === 'wishlist' ? (
                <iv-wishlist-view />
              ) : (
                this.contentName && <slot name={this.contentName}></slot>
              )}
            </div>
          </div>
        )}
      </Host>
    );

  };

};