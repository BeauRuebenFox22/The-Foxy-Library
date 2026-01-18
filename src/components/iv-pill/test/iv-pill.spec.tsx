import { newSpecPage } from '@stencil/core/testing';
import { IvPill } from '../iv-pill';

describe('iv-pill', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvPill],
      html: `<iv-pill></iv-pill>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-pill>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-pill>
    `);
  });
});
