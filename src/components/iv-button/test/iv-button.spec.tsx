import { newSpecPage } from '@stencil/core/testing';
import { IvButton } from '../iv-button';

describe('iv-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvButton],
      html: `<iv-button></iv-button>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-button>
    `);
  });
});
