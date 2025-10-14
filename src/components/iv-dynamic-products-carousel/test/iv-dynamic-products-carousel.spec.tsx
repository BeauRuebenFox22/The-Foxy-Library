import { newSpecPage } from '@stencil/core/testing';
import { IvDynamicProductsCarousel } from '../iv-dynamic-products-carousel';

describe('iv-dynamic-products-carousel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvDynamicProductsCarousel],
      html: `<iv-dynamic-products-carousel></iv-dynamic-products-carousel>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-dynamic-products-carousel>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-dynamic-products-carousel>
    `);
  });
});
