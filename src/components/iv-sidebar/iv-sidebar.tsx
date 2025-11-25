import { Component, h, Listen, State, Prop } from '@stencil/core';
import {
  NewsletterTimerState, NewsletterTimerOptions, createNewsletterTimerState, handleNewsletterExitIntent,
  startNewsletterTimer, pauseNewsletterTimer, resumeNewsletterTimer, hasNewsletterPopupShown
} from '../../utils/shared/newsletter-timer';

const BLOCK = 'iv-sidebar';

@Component({
  tag: 'iv-sidebar',
  styleUrl: 'iv-sidebar.scss',
  shadow: false
})

export class IvSidebar {

  @Prop() newsletterpopuptrigger?: NewsletterTimerOptions['newsletterpopuptrigger'];
  @Prop() newsletterpopuptimedelay?: NewsletterTimerOptions['newsletterpopuptimedelay'];
  
  @State() sidebarState: boolean = false;
  @State() contentName: string;

  private newsletterTimerState: NewsletterTimerState = createNewsletterTimerState();

  @Listen('openSidebar', { target: 'document' })
  handleopenSidebar(event: CustomEvent) {
    pauseNewsletterTimer(this.newsletterTimerState);
    const { content } = event.detail;
    this.contentName = content;
    this.toggleSidebar();
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
            this.toggleSidebar();
          }
        );
      };
      if(this.newsletterpopuptrigger === 'exit_intent' && 
        !hasNewsletterPopupShown()
      ) {
        document.addEventListener('mouseout', (event) => {
          handleNewsletterExitIntent({
            event,
            modalState: this.sidebarState,
            contentName: this.contentName,
            toggleModal: this.toggleSidebar.bind(this),
            setContentName: (name: string) => this.contentName = name,
            setSession: () => sessionStorage.setItem('newsletterPopupShown', 'true')
          });
        });
      };
  };

  private toggleSidebar() {
    this.sidebarState = !this.sidebarState;
    if(!this.sidebarState) {
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
            this.toggleSidebar();
          }
        );
      };
    };
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