import { newSpecPage } from '@stencil/core/testing';
import { IvTabs } from '../iv-tabs';

describe('iv-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvTabs],
      html: `<iv-tabs></iv-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-tabs>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-tabs>
    `);
  });
});
