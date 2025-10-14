import { newSpecPage } from '@stencil/core/testing';
import { IvToast } from '../iv-toast';

describe('iv-toast', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvToast],
      html: `<iv-toast></iv-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-toast>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-toast>
    `);
  });
});
