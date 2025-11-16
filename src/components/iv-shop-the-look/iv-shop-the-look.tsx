import { Component, h, Prop } from '@stencil/core';

const BLOCK = 'iv-shop-the-look';

@Component({
  tag: 'iv-shop-the-look',
  styleUrl: 'iv-shop-the-look.scss',
  shadow: false
})

export class IvShopTheLook {

  @Prop() behaviour: 'modal' | 'link' | 'tooltip';
  @Prop() coordinates: string;
  @Prop() producthandles?: string;

  private get getCoordinates(): Array<{ x: number, y: number }> | null {
    if(!this.coordinates) return null;
    try {
      const cords = this.coordinates.split(',').map(pair => {
        const [x, y] = pair.split('|').map(num => Number(num.trim()));
        return { x, y };
      });
      console.log(cords);
      return cords;
    } catch (error) {
      return null;
    };
  };

  render() {

    return (

      <div class={BLOCK}>
        <div class={`${BLOCK}-image-container`}>
          <slot name="image" />
          {this.getCoordinates?.map((cord, index) => (
            <iv-product-pin
              pinProduct={`Foxy Product ${index + 1}`}
              pinKey={index}
              pinCords={cord}
              pinBehaviour={this.behaviour} />
          ))}
        </div>
      </div>

    );

  };

};