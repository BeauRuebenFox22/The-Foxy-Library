import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { isValueEmail } from '../../utils/helpers/factory';

const BLOCK = 'iv-newsletter';
export interface NewsletterSuccessDetail { email: string }
export interface NewsletterFailDetail { reason: string; error?: string; email?: string }

@Component({
  tag: 'iv-newsletter',
  styleUrl: 'iv-newsletter.scss',
  shadow: false
})

export class IvNewsletter {

  @Prop() formimageurl?: string;
  @Prop() formimageposition?: 'top' | 'cover';
  @Prop() formimageheight?: string;
  @Prop() formsubmitbtntext: string = 'Subscribe';
  @Prop() formsuccessmessage?: string;
  @Prop() formfailuremessage?: string;
  @Prop() formplaceholdertext?: string;
  @Prop() formlabeltext?: string;
  @Prop() formstackbutton: boolean = false;
  @Prop() formtitletag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' = 'h2';
  @Prop() formtitletext?: string;
  @Prop() formdescriptiontext?: string;
  @Prop() includeloadingspinner: boolean = true;
  @Prop() newsletterpopupdisclaimer?: string;

  @State() email: string = '';
  @State() formFeedback: string = '';
  @State() status: 'idle' | 'submitting' | 'success' | 'error' = 'idle';

  @Event() newsletterSuccess: EventEmitter<NewsletterSuccessDetail>;
  @Event() newsletterFail: EventEmitter<NewsletterFailDetail>;

  private getEffectiveSuccessMessage(): string | undefined {
    return this.formsuccessmessage || (window as any).newsletterSuccessMessage;
  };

  private submitHandler(event: Event) {
    event.preventDefault();
    this.status = 'submitting';
    if(!isValueEmail(this.email)) {
      this.formFeedback = 'Please enter a valid email address.';
      this.status = 'error';
      this.newsletterFail.emit({ reason: 'invalid-email'});
      return;
    }
    const effectiveSuccessMessage = this.getEffectiveSuccessMessage();
    const form = event.target as HTMLFormElement;
    const email = (form.querySelector('[name="contact[email]"]') as HTMLInputElement).value;
    const formData = new FormData();
    formData.append('contact[email]', email);
    formData.append('form_type', 'customer');
    formData.append('utf8', '✓');
    fetch('/contact', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(html => {
      if(effectiveSuccessMessage && html.includes(this.formsuccessmessage)) {
        this.status = 'success';
        this.formFeedback = effectiveSuccessMessage;
        this.newsletterSuccess.emit({ email });
        form.reset();
      } else {
        throw new Error(this.formfailuremessage || 'There was a problem. Please try again.');
      }
    })
    .catch((error) => {
      this.status = 'error';
      this.formFeedback = this.formfailuremessage || error.message;
      this.newsletterFail.emit({ reason: 'shopify-failure', error: this.formFeedback, email });
    })
  };

  render() {

    const TAG = this.formtitletag as any;

    return (

      <div class={`${BLOCK} status-${this.status} ${this.includeloadingspinner && `${BLOCK}-with-spinner`}`}>
        {this.formimageurl && (
          <img 
            class={`${BLOCK}-image ${BLOCK}-image-${this.formimageposition}`} 
            style={{ height: `${this.formimageheight}px` }}
            src={this.formimageurl} />
        )}
        {(this.formtitletext || this.formdescriptiontext) && (
          <div class={`${BLOCK}-header`}>
            {this.formtitletext && <TAG class={`${BLOCK}-title`}>{this.formtitletext}</TAG>}
            {this.formdescriptiontext && <p class={`${BLOCK}-description`}>{this.formdescriptiontext}</p>}
          </div>
        )}
        <form 
          class={`${BLOCK}-form`} 
          method="post"
          action="/contact"
          onSubmit={(event) => this.submitHandler(event)} 
          accept-charset="UTF-8"
          aria-busy={this.status === 'submitting'}
          aria-live="polite">
          <input type="hidden" name="form_type" value="customer"/>
          <input type="hidden" name="utf8" value="✓"/>
          {this.formlabeltext && 
            <label htmlFor="ContactForm-email" class={`${BLOCK}-form-label`}>{this.formlabeltext}</label>
          }
          <div class={`${BLOCK}-form-row${this.formstackbutton ? ` ${BLOCK}-form-row--stacked` : ''}`}>
            <input 
              id="ContactForm-email" 
              class={`${BLOCK}-form-input`} 
              type="email" 
              name="contact[email]" 
              {...(this.formplaceholdertext ? { placeholder: this.formplaceholdertext } : {})}
              onInput={(event: any) => this.email = event.target.value}
              value={this.email}
              required
              aria-required="true"
              aria-label={this.formlabeltext || 'Email'}
              autoComplete="email"/>
            <button 
              class={`${BLOCK}-form-button`}
              type="submit"
              disabled={this.status === 'submitting'}
              aria-disabled={this.status === 'submitting'}>
              {this.formsubmitbtntext}
            </button>
          </div>
        </form>
        {this.includeloadingspinner && this.status === 'submitting' &&
          <iv-spinner show={true}></iv-spinner>
        }
        {
          this.newsletterpopupdisclaimer &&
          <p class={`${BLOCK}-disclaimer`}>{this.newsletterpopupdisclaimer}</p>
        }
        {this.formFeedback && (
          <div class={`${BLOCK}-form-feedback`} aria-live="polite">
            <p class={`${BLOCK}-form-feedback`}>{this.formFeedback}</p>
          </div>
        )}
      </div>

    );
  
  };

};