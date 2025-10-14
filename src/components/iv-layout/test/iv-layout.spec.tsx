import { newSpecPage } from '@stencil/core/testing';
import { IvLayout } from '../iv-layout';

describe('iv-layout', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvLayout],
      html: `<iv-layout></iv-layout>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-layout>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-layout>
    `);
  });
});
