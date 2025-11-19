import { Component, h, Prop, State, Element } from '@stencil/core';

const BLOCK = 'iv-carousel';

@Component({
  tag: 'iv-carousel',
  styleUrl: 'iv-carousel.scss',
  shadow: false,
})

export class IvCarousel {

  @Prop() navArrows?: boolean;
  @Prop() navDots?: boolean;
  @Prop() autoPlay: boolean = false;
  @Prop() autoPlaySpeed: number = 3000;
  @State() currentIndex: number = 0;
  @State() items: HTMLElement[] = [];
  @Element() el: HTMLElement;

  private autoplayInterval: any;

  componentWillLoad(){
    this.items = this.buildSlideItems()
  };

  componentDidLoad() {
    this.updateActiveSlide();
    if(this.autoPlay) {
      this.autoplayInterval = setInterval(() => {
        this.navigate('right');
      }, this.autoPlaySpeed);
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
        <div class={`${BLOCK}__item`}>
          <slot/>
        </div>
        {this.navDots && (
          <div class="carousel-dots">
            {this.items.map((_item, index) => (
              <button
                class={`dot ${index === this.currentIndex ? 'active' : ''}`}
                onClick={() => this.setCurrentIndex(index)}>
              </button>
            ))}
          </div>
        )}
        {this.navArrows && (
          <div class="arrow-wrapper">
            <button class="arrow left" onClick={() => this.navigate('left')}>‹</button>
            <button class="arrow right" onClick={() => this.navigate('right')}>›</button>
          </div>
        )}
      </div>
    );

  };

};