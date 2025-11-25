import { hasSessionItem, setSessionItem } from '../storage/factory';

export interface NewsletterTimerOptions {
  newsletterpopuptrigger?: 'time_delay' | 'exit_intent';
  newsletterpopuptimedelay?: number;
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

export function handleNewsletterExitIntent({
  event,
  modalState,
  contentName,
  toggleModal,
  setContentName,
  setSession
}: {
  event: MouseEvent,
  modalState: boolean,
  contentName: string,
  toggleModal: () => void,
  setContentName: (name: string) => void,
  setSession: () => void
}) {
  if(event.clientY <= 0 && !hasNewsletterPopupShown()){
    if(modalState && contentName !== 'newsletter') {
      toggleModal();
      setTimeout(() => {
        setContentName('newsletter');
        toggleModal();
        setSession();
      }, 300);
    } else {
      setContentName('newsletter');
      toggleModal();
      setSession();
    };
    document.removeEventListener('mouseout', handleNewsletterExitIntent as any);
  };
};

export function createNewsletterTimerState(): NewsletterTimerState {
  return {
    newsletterTimer: null,
    newsletterTimerRemaining: 0,
    newsletterTimerStart: 0,
  };
};