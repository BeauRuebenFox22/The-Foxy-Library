import { newSpecPage } from '@stencil/core/testing';
import { IvWishlist } from '../iv-wishlist';

describe('iv-wishlist', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvWishlist],
      html: `<iv-wishlist></iv-wishlist>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-wishlist>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-wishlist>
    `);
  });
});
