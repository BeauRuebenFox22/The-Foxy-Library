import { newSpecPage } from '@stencil/core/testing';
import { SwSizeGuide } from '../sw-size-guide';

describe('sw-size-guide', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SwSizeGuide],
      html: `<sw-size-guide></sw-size-guide>`,
    });
    expect(page.root).toEqualHtml(`
      <sw-size-guide>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sw-size-guide>
    `);
  });
});
