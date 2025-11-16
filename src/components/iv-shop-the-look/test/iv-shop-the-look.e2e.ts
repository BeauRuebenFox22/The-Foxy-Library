import { newE2EPage } from '@stencil/core/testing';

describe('iv-shop-the-look', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-shop-the-look></iv-shop-the-look>');

    const element = await page.find('iv-shop-the-look');
    expect(element).toHaveClass('hydrated');
  });
});
