import { newSpecPage } from '@stencil/core/testing';
import { IvSuggest } from '../iv-suggest';

describe('iv-suggest', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvSuggest],
      html: `<iv-suggest></iv-suggest>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-suggest>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-suggest>
    `);
  });
});
