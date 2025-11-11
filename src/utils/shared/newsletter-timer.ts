import { hasSessionItem, setSessionItem } from '../storage/factory';

export interface NewsletterTimerOptions {
  newsletterpopuptrigger?: 'time_delay' | 'exit_intent';
  newsletterpopuptimedelay?: number;
  newsletterpopuptitle?: string;
  newsletterpopuptext?: string;
  newsletterpopupimage?: string;
  newsletterpopupdisclaimer?: string;
};

export interface NewsletterTimerState {
  newsletterTimer: ReturnType<typeof setTimeout> | null;
  newsletterTimerRemaining: number;
  newsletterTimerStart: number;
};

export function startNewsletterTimer(
  state: NewsletterTimerState,
  delay: number,
  onTrigger: () => void
) {
  state.newsletterTimerStart = Date.now();
  state.newsletterTimerRemaining = delay;
  state.newsletterTimer = setTimeout(() => {
    onTrigger();
    setSessionItem('newsletterPopupShown', 'true');
    state.newsletterTimer = null;
  }, state.newsletterTimerRemaining);
};

export function pauseNewsletterTimer(state: NewsletterTimerState) {
  if(state.newsletterTimer) {
    clearTimeout(state.newsletterTimer);
    state.newsletterTimerRemaining -= Date.now() - state.newsletterTimerStart;
    state.newsletterTimer = null;
  };
};

export function resumeNewsletterTimer(
  state: NewsletterTimerState,
  onTrigger: () => void
) {
  if(state.newsletterTimerRemaining > 0) {
    state.newsletterTimerStart = Date.now();
    state.newsletterTimer = setTimeout(() => {
      onTrigger();
      setSessionItem('newsletterPopupShown', 'true');
      state.newsletterTimer = null;
    }, state.newsletterTimerRemaining)
  };
};

export function hasNewsletterPopupShown(): boolean {
  return hasSessionItem('newsletterPopupShown');
};

export function createNewsletterTimerState(): NewsletterTimerState {
  return {
    newsletterTimer: null,
    newsletterTimerRemaining: 0,
    newsletterTimerStart: 0,
  };
};