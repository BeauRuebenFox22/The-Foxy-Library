import { newSpecPage } from '@stencil/core/testing';
import { IvAccordion } from '../iv-accordion';

describe('iv-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvAccordion],
      html: `<iv-accordion></iv-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-accordion>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-accordion>
    `);
  });
});
