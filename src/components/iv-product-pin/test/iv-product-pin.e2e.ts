import { newE2EPage } from '@stencil/core/testing';

describe('iv-product-pin', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-product-pin></iv-product-pin>');

    const element = await page.find('iv-product-pin');
    expect(element).toHaveClass('hydrated');
  });
});
