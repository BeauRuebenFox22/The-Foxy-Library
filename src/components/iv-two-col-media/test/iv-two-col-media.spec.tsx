import { newSpecPage } from '@stencil/core/testing';
import { IvTwoColMedia } from '../iv-two-col-media';

describe('iv-two-col-media', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvTwoColMedia],
      html: `<iv-two-col-media></iv-two-col-media>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-two-col-media>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-two-col-media>
    `);
  });
});
