import { newSpecPage } from '@stencil/core/testing';
import { IvBanner } from '../iv-banner';

describe('iv-banner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvBanner],
      html: `<iv-banner></iv-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-banner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-banner>
    `);
  });
});
