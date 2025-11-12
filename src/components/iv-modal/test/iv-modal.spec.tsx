import { newSpecPage } from '@stencil/core/testing';
import { IvModal } from '../iv-modal';

describe('iv-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvModal],
      html: `<iv-modal></iv-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-modal>
      </iv-modal>
    `);
  });
});
