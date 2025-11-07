import { newSpecPage } from '@stencil/core/testing';
import { IvProductUpsell } from '../iv-product-upsell';

describe('iv-product-upsell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvProductUpsell],
      html: `<iv-product-upsell></iv-product-upsell>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-product-upsell>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-product-upsell>
    `);
  });
});
