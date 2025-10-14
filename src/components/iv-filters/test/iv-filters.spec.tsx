import { newSpecPage } from '@stencil/core/testing';
import { IvFilters } from '../iv-filters';

describe('iv-filters', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvFilters],
      html: `<iv-filters></iv-filters>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-filters>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-filters>
    `);
  });
});
