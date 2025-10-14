import { newE2EPage } from '@stencil/core/testing';

describe('iv-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-modal></iv-modal>');

    const element = await page.find('iv-modal');
    expect(element).toHaveClass('hydrated');
  });
});
