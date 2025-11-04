import { newSpecPage } from '@stencil/core/testing';
import { IvNewsletter } from '../iv-newsletter';

describe('iv-newsletter', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvNewsletter],
      html: `<iv-newsletter></iv-newsletter>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-newsletter>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-newsletter>
    `);
  });
});
