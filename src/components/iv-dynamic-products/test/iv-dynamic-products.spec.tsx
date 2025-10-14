import { newSpecPage } from '@stencil/core/testing';
import { IvDynamicProducts } from '../iv-dynamic-products';

describe('iv-dynamic-products', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvDynamicProducts],
      html: `<iv-dynamic-products></iv-dynamic-products>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-dynamic-products>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-dynamic-products>
    `);
  });
});
