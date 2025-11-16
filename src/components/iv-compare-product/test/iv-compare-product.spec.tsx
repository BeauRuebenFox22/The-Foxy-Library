import { newSpecPage } from '@stencil/core/testing';
import { IvCompareProduct } from '../iv-compare-product';

describe('iv-compare-product', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvCompareProduct],
      html: `<iv-compare-product></iv-compare-product>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-compare-product>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-compare-product>
    `);
  });
});
