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

  /** Prevent anchor navigation when controls sit inside a link wrapper */
  private handleDotClick(e: MouseEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    this.setCurrentIndex(index);
  };

  private handleArrowClick(e: MouseEvent, direction: 'left' | 'right') {
    e.preventDefault();
    e.stopPropagation();
    this.navigate(direction);
  };

  render() {

    return (
      <div class={BLOCK}>
        <div class={`${BLOCK}-items valign-${this.valign} halign-${this.halign} ${this.hasoverlay ? 'has-overlay' : ''}`}>
          <slot/>
        </div>
        {this.navdots && (
          <div class={`${BLOCK}-dots`} onClick={e => e.stopPropagation()}>
            {this.items.map((_item, index) => (
              <button
                type="button"
                class={`dot ${index === this.currentIndex ? 'active' : ''}`}
                onClick={(e) => this.handleDotClick(e, index)}
              />
            ))}
          </div>
        )}
        {this.navarrows && (
          <div class={`${BLOCK}-arrow-wrapper`} onClick={e => e.stopPropagation()}>
            <button type="button" class="arrow left" onClick={(e) => this.handleArrowClick(e,'left')}>‹</button>
            <button type="button" class="arrow right" onClick={(e) => this.handleArrowClick(e,'right')}>›</button>
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