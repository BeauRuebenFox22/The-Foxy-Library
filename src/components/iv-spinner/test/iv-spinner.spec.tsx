import { newSpecPage } from '@stencil/core/testing';
import { IvSpinner } from '../iv-spinner';

describe('iv-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvSpinner],
      html: `<iv-spinner></iv-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-spinner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-spinner>
    `);
  });
});
