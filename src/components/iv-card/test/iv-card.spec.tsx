import { newSpecPage } from '@stencil/core/testing';
import { IvCard } from '../iv-card';

describe('iv-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvCard],
      html: `<iv-card></iv-card>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-card>
    `);
  });
});
