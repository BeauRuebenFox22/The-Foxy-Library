import { newSpecPage } from '@stencil/core/testing';
import { IvAgeVerify } from '../iv-age-verify';

describe('iv-age-verify', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvAgeVerify],
      html: `<iv-age-verify></iv-age-verify>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-age-verify>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-age-verify>
    `);
  });
});
