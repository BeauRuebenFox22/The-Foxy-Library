import { newE2EPage } from '@stencil/core/testing';

describe('iv-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-sidebar></iv-sidebar>');

    const element = await page.find('iv-sidebar');
    expect(element).toHaveClass('hydrated');
  });
});
