import { newSpecPage } from '@stencil/core/testing';
import { IvSidebar } from '../iv-sidebar';

describe('iv-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvSidebar],
      html: `<iv-sidebar></iv-sidebar>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-sidebar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-sidebar>
    `);
  });
});
