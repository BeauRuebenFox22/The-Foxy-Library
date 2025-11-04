import { newSpecPage } from '@stencil/core/testing';
import { IvIconList } from '../iv-link-list';

describe('iv-icon-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvIconList],
      html: `<iv-icon-list></iv-icon-list>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-icon-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-icon-list>
    `);
  });
});
