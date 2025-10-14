import { newE2EPage } from '@stencil/core/testing';

describe('iv-wishlist-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-wishlist-view></iv-wishlist-view>');

    const element = await page.find('iv-wishlist-view');
    expect(element).toHaveClass('hydrated');
  });
});
