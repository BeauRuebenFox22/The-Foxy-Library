import { newE2EPage } from '@stencil/core/testing';

describe('iv-wishlist', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-wishlist></iv-wishlist>');

    const element = await page.find('iv-wishlist');
    expect(element).toHaveClass('hydrated');
  });
});
