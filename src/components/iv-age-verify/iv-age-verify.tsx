import { Component, Host, h, Prop, State } from '@stencil/core';
import { hasCookie, getCookie, setCookie } from '../../utils/storage/factory';
import { SecurityFactory } from '../../utils/security/factory';
import { Verify } from 'crypto';

const verify = new SecurityFactory();

@Component({
  tag: 'iv-age-verify',
  styleUrl: 'iv-age-verify.scss',
  shadow: false
})

export class IvAgeVerify {

  private readonly verifiedMarker = 'verified';
  private readonly deniedMarker = 'denied';

  @Prop() minAge?: number = 18;
  @Prop() verificationMethod: 'boolean' | 'date' | 'age' = 'age';
  @Prop() redirectUrl?: string = '';
  @Prop() cookieName: string = 'iv-age-verified';
  @Prop() cookieDays: number = 7;


  @State() ageChecked: boolean = hasCookie(this.cookieName);
  @State() isOfAge: boolean = verify.

  private calculateAgeFromBirthdate(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if(m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    };
    return age;
  };

  private compareAgeAgainstMinAge(age: number): boolean {
    if(this.minAge === undefined) return true;
    return age >= this.minAge;
  };

  render() {

    return (
      <Host>
        <slot></slot>
      </Host>
    );

  };

};