import { newSpecPage } from '@stencil/core/testing';
import { IvRecentlyViewed } from '../iv-recently-viewed';

describe('iv-recently-viewed', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvRecentlyViewed],
      html: `<iv-recently-viewed></iv-recently-viewed>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-recently-viewed>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-recently-viewed>
    `);
  });
});
