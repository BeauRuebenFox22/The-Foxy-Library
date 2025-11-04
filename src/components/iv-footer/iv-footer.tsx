import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-footer';

@Component({
  tag: 'iv-footer',
  styleUrl: 'iv-footer.scss',
  shadow: false
})

export class IvFooter {

  @Prop() includenewsletter?: boolean;
  @Prop() includecontacticons?: boolean;
  @Prop() includesocialicons?: boolean;
  @Prop() includesupportedpayments?: boolean;
  @Prop() includesitelinks?: boolean;
  @Prop() sitelinkcollapse?: boolean;
  @Prop() includecopyright?: boolean;


  // Use blocks to add the sub-components conditionally, set there properties from block settings 
  // When a block is rendered the outer div will also be added and will contain a named area, so we can use grid templates to position them correctly
  // We'll probably need to use the iv-layout component to help with this too
  // Parental component, iv-footer will take a prop to control the layout
  
  render() {
  
    return (
      <footer class={BLOCK}>
        {this.includenewsletter &&(
        <div class={`${BLOCK}-newsletter`}>
          <iv-newsletter />
        </div>
        )}
        {this.includesocialicons &&(
        <div class={`${BLOCK}-social-icons`}>

        </div>
        )}
        {this.includecopyright &&(
        <div class={`${BLOCK}-base`}>
          <p class={`${BLOCK}-base-text`}>© {new Date().getFullYear()} Stephen Webster. All rights reserved.</p>
        </div>
        )}
      </footer>
    );
  
  };

};