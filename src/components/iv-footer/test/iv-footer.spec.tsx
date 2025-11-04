import { newSpecPage } from '@stencil/core/testing';
import { IvFooter } from '../iv-footer';

describe('iv-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvFooter],
      html: `<iv-footer></iv-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-footer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-footer>
    `);
  });
});
