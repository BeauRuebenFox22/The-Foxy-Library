import { newE2EPage } from '@stencil/core/testing';

describe('iv-dynamic-products-carousel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-dynamic-products-carousel></iv-dynamic-products-carousel>');

    const element = await page.find('iv-dynamic-products-carousel');
    expect(element).toHaveClass('hydrated');
  });
});
