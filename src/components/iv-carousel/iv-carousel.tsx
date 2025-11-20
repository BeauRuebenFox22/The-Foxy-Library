import { Component, h, Prop, State, Element } from '@stencil/core';

const BLOCK = 'iv-carousel';

@Component({
  tag: 'iv-carousel',
  styleUrl: 'iv-carousel.scss',
  shadow: false,
})

export class IvCarousel {

  @Prop() navarrows?: boolean;
  @Prop() navdots?: boolean;
  @Prop() showslidecount?: boolean;
  @Prop() autoplay: boolean = false;
  @Prop() autoplayspeed: number = 3000;
  @Prop() valign: 'top' | 'center' | 'bottom' = 'center';
  @Prop() halign: 'left' | 'center' | 'right' = 'center';
  @Prop() hasoverlay: boolean = false;
  
  @State() currentIndex: number = 0;
  @State() items: HTMLElement[] = [];

  @Element() el: HTMLElement;

  private autoplayInterval: any;

  componentWillLoad(){
    this.items = this.buildSlideItems()
  };

  componentDidLoad() {
    this.updateActiveSlide();
    if(this.autoplay) {
      this.autoplayInterval = setInterval(() => {
        this.navigate('right');
      }, this.autoplayspeed);
    };
  };

  disconnectedCallback() {
    if(this.autoplayInterval) clearInterval(this.autoplayInterval);
  };

  private buildSlideItems(): HTMLElement[] {
    const items = Array.from(this.el.querySelectorAll('.iv-carousel-item'));
    return items as HTMLElement[];
  };

  private updateActiveSlide() {
    this.items.forEach((item, idx) => {
      idx === this.currentIndex
        ? item.classList.add('active')
        : item.classList.remove('active');
    });
  };    

  private setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.updateActiveSlide();
  };

  private navigate(direction: 'left' | 'right') {
    if(direction === 'left') {
      this.currentIndex = this.currentIndex === 0
        ? this.items.length - 1
        : this.currentIndex - 1;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    }
    this.updateActiveSlide();
  };

  render() {

    return (
      <div class={BLOCK}>
        <div class={`${BLOCK}-items valign-${this.valign} halign-${this.halign} ${this.hasoverlay && 'has-overlay'}`}>
          <slot/>
        </div>
        {this.navdots && (
          <div class={`${BLOCK}-dots`}>
            {this.items.map((_item, index) => (
              <button
                class={`dot ${index === this.currentIndex ? 'active' : ''}`}
                onClick={() => this.setCurrentIndex(index)}>
              </button>
            ))}
          </div>
        )}
        {this.navarrows && (
          <div class={`${BLOCK}-arrow-wrapper`}>
            <button class="arrow left" onClick={() => this.navigate('left')}>‹</button>
            <button class="arrow right" onClick={() => this.navigate('right')}>›</button>
          </div>
        )}
        {this.navarrows && this.showslidecount && (
          <div class={`${BLOCK}-slide-count`}>
            <span>
              {this.currentIndex + 1} / {this.items.length}
            </span>
          </div>
        )}
      </div>
    );

  };

};