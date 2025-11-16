import { newSpecPage } from '@stencil/core/testing';
import { IvProductPin } from '../iv-product-pin';

describe('iv-product-pin', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvProductPin],
      html: `<iv-product-pin></iv-product-pin>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-product-pin>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-product-pin>
    `);
  });
});
