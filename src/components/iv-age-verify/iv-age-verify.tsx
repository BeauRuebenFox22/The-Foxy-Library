import { Component, h, Prop, State } from '@stencil/core';
import { getCookie, hasCookie, setCookie } from '../../utils/storage/factory';
import { SecurityFactory } from '../../utils/security/factory';

@Component({
  tag: 'iv-age-verify',
  styleUrl: 'iv-age-verify.scss',
  shadow: false
})

export class IvAgeVerify {

  private readonly cookieSecret = 'iv-age-verify-secret';
  private cookieWatchId: number | null = null;
  private readonly cookieName = 'iv-age-verified';

  @Prop() minage: number = 18;
  @Prop() verificationmethod: 'boolean' | 'date' | 'age' = 'age';
  @Prop() cookiedays: number = 7;
  @Prop() verificationtitle: string = 'Age Verification';
  @Prop() verificationimage: boolean = false;

  @State() ageChecked: boolean = false;
  @State() isOfAge: boolean = false;

  async componentWillLoad() {
    const has = hasCookie(this.cookieName);
    this.ageChecked = has;
    if(!has) {
      this.isOfAge = false;
      return;
    };
    const cookieValue = getCookie(this.cookieName);
    if(!cookieValue) {
      this.ageChecked = false;
      this.isOfAge = false;
      return;
    };

    let derivedIsOfAge: boolean | null = null;

    try {
      const matchesTrue = await SecurityFactory.verifyHmacSha256('true', this.cookieSecret, cookieValue);
      const matchesFalse = !matchesTrue && await SecurityFactory.verifyHmacSha256('false', this.cookieSecret, cookieValue);
      if(matchesTrue) derivedIsOfAge = true;
      else if (matchesFalse) derivedIsOfAge = false;
    } catch {
      derivedIsOfAge = null;
    };

    if(derivedIsOfAge === null) {
      this.ageChecked = false;
      this.isOfAge = false;
      return;
    };

    this.isOfAge = derivedIsOfAge;

    if(!this.isOfAge) this.bounceUser();
  };

  componentDidLoad() {
    if(!this.ageChecked) document.body.classList.add('iv-age-verify-noscroll');
    this.startCookieWatch();
  };

  componentDidUpdate() {
    this.ageChecked
      ? document.body.classList.remove('iv-age-verify-noscroll')
      : document.body.classList.add('iv-age-verify-noscroll');
  };

  disconnectedCallback() { this.stopCookieWatch(); };

  private startCookieWatch() {
    if(this.cookieWatchId !== null) return;
    this.cookieWatchId = window.setInterval(() => {
      const has = hasCookie(this.cookieName);
      if(!has && this.ageChecked) {
        this.ageChecked = false;
        this.isOfAge = false;
      };
    }, 1000);
  };

  private stopCookieWatch() {
    if(this.cookieWatchId !== null) {
      window.clearInterval(this.cookieWatchId);
      this.cookieWatchId = null;
    };
  };

  private async handleAgeSubmit(e: Event) {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('#age-input') as HTMLInputElement;
    const age = parseInt(input.value, 10);
    const isOfAge = this.compareAgeAgainstminage(age);
    await this.setVerificationResult(isOfAge);
  };

  private async handleDateSubmit(e: Event) {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('#birthdate-input') as HTMLInputElement;
    const birthdate = new Date(input.value);
    const age = this.calculateAgeFromBirthdate(birthdate);
    const isOfAge = this.compareAgeAgainstminage(age);
    await this.setVerificationResult(isOfAge);
  };

  private async handleBooleanSubmit(e: Event) {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('input[name="age-confirm"]:checked') as HTMLInputElement;
    const isOfAge = input && input.value === 'yes';
    await this.setVerificationResult(isOfAge);
  };

  private async setVerificationResult(isOfAge: boolean) {
    const value = isOfAge ? 'true' : 'false';
    const digest = await SecurityFactory.hmacSha256(value, this.cookieSecret);
    setCookie(this.cookieName, digest, this.cookiedays);
    this.ageChecked = true;
    this.isOfAge = isOfAge;
    if(!isOfAge) this.bounceUser();
  };

  private bounceUser() {
    try {
      window.history.length > 1
        ? window.history.back()
        : window.location.href = 'about:blank';
    } catch {
      window.location.href = 'about:blank';
    };
  };

  private calculateAgeFromBirthdate(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if(m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    };
    return age;
  };

  private compareAgeAgainstminage(age: number): boolean {
    if(this.minage === undefined) return true;
    return age >= this.minage;
  };

  private returnAgeInputMarkup() {
    return (
      <form class="iv-age-verify-form" onSubmit={e => this.handleAgeSubmit(e)}>
        <input id="age-input" type="number" min="0" required />
        <button type="submit">Verify</button>
      </form>
    );
  };

  private returnDateInputMarkup() {
    return (
      <form class="iv-age-verify-form" onSubmit={e => this.handleDateSubmit(e)}>
        <input id="birthdate-input" type="date" required />
        <button type="submit">Verify</button>
      </form>
    );
  };

  private returnBooleanInputMarkup() {
    return (
      <form class="iv-age-verify-form" onSubmit={e => this.handleBooleanSubmit(e)}>
        <div>
          <input id="yes" name="age-confirm" type="radio" value="yes" required />
          <label htmlFor="yes">Yes</label>
          <input id="no" name="age-confirm" type="radio" value="no" />
          <label htmlFor="no">No</label>
        </div>
        <button type="submit">Verify</button>
      </form>
    );
  };

  render() {

    if(!this.ageChecked) {
        return (
          <div class="iv-age-verify-overlay">
            <div class="iv-age-verify-modal">
              {this.verificationimage && (
                <div
                  class="iv-age-verify-image-container"
                  style={{
                    '--iv-age-verify-image': `url('${this.verificationimage}')`
                  } as any}
                ></div>
              )}
              <div class="iv-age-verify-content">
                <h2>{this.verificationtitle}</h2>
                {this.verificationmethod === 'age' && this.returnAgeInputMarkup()}
                {this.verificationmethod === 'date' && this.returnDateInputMarkup()}
                {this.verificationmethod === 'boolean' && this.returnBooleanInputMarkup()}
              </div>
            </div>
          </div>
        );
      }
      return null;
  };

};