import { newSpecPage } from '@stencil/core/testing';
import { SwInGridContent } from '../sw-in-grid-content';

describe('sw-in-grid-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SwInGridContent],
      html: `<sw-in-grid-content></sw-in-grid-content>`,
    });
    expect(page.root).toEqualHtml(`
      <sw-in-grid-content>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sw-in-grid-content>
    `);
  });
});
