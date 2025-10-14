import { newSpecPage } from '@stencil/core/testing';
import { IvToastContainer } from '../iv-toast-container';

describe('iv-toast-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvToastContainer],
      html: `<iv-toast-container></iv-toast-container>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-toast-container>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-toast-container>
    `);
  });
});
