import { newSpecPage } from '@stencil/core/testing';
import { IvLink } from '../iv-link';

describe('iv-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvLink],
      html: `<iv-link></iv-link>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-link>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-link>
    `);
  });
});
