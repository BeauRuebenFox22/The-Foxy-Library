import { newSpecPage } from '@stencil/core/testing';
import { IvCarousel } from '../iv-carousel';

describe('iv-carousel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvCarousel],
      html: `<iv-carousel></iv-carousel>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-carousel>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-carousel>
    `);
  });
});
