import { newSpecPage } from '@stencil/core/testing';
import { IvWishlistView } from '../iv-wishlist-view';

describe('iv-wishlist-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvWishlistView],
      html: `<iv-wishlist-view></iv-wishlist-view>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-wishlist-view>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-wishlist-view>
    `);
  });
});
