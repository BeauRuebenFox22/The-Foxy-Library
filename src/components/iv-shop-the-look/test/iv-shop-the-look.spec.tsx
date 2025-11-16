import { newSpecPage } from '@stencil/core/testing';
import { IvShopTheLook } from '../iv-shop-the-look';

describe('iv-shop-the-look', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvShopTheLook],
      html: `<iv-shop-the-look></iv-shop-the-look>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-shop-the-look>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-shop-the-look>
    `);
  });
});
