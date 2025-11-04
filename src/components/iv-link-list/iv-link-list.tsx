import { Component, h, Prop } from '@stencil/core';
import { requestedFields, isValueEmail, isValuePhoneNumber } from '../../utils/helpers/factory';
import 'ionicons';

const BLOCK = 'iv-link-list';

@Component({
  tag: 'iv-link-list',
  styleUrl: 'iv-link-list.scss',
  shadow: false
})

export class IvIconList {

  @Prop() linktype: 'social' | 'contact' | 'text' = 'social';
  @Prop() showicons: boolean = false;
  @Prop() links: string;
  @Prop() layout: 'vertical' | 'horizontal' = 'vertical';

  private getSocialSource(link: string): string {
    try {
      const urlObj = new URL(link);
      const host = urlObj.hostname.replace('www.', '');
      return host.split('.')[0];
    } catch {
      return link;
    };
  };

  private getCustomLabel(link: string): { url: string, customLabel: string } {
    const [url, customLabel] = link.split('|');
    return { url, customLabel };
  };

  private constructLinkObject(): Array<{ url: string, icon?: string, label: string }> | null {
    const links = requestedFields(this.links);
    const linkObject = [];
    links?.forEach((link, _index) => {
      let url = link;
      let label = '';
      let customLabel = '';
      if(this.linktype === 'contact' && link.includes('|')) {
        const result = this.getCustomLabel(link);
        url = result.url.trim();
        customLabel = result.customLabel.trim();
      }
      if(isValueEmail(link)) link = `mailto:${link}`;
      if(isValuePhoneNumber(link)) link = `tel:${link}`;
      label = customLabel || (this.linktype === 'social' ? this.getSocialSource(url) : url);
      linkObject.push({
        url,
        label,
        icon: this.linktype === 'social' ? `logo-${this.getSocialSource(url)}` : 'call'
      });
    });
    return linkObject.length ? linkObject : null;
  };

  render() {

    return (

      <ul class={BLOCK + ` ${BLOCK}--${this.layout}`}>
        {this.constructLinkObject()?.map((link, index) => (
          <li class={`${BLOCK}-item`} key={index}>
            <a class={`${BLOCK}-link`} href={link.url} target="_blank" rel="noopener noreferrer">
              { this.showicons && <ion-icon name={link.icon}></ion-icon> }
              { link.label }
            </a>
          </li>
        ))}
      </ul>
    
    );
  
  };

};