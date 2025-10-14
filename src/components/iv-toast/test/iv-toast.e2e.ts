import { newE2EPage } from '@stencil/core/testing';

describe('iv-toast', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-toast></iv-toast>');

    const element = await page.find('iv-toast');
    expect(element).toHaveClass('hydrated');
  });
});
