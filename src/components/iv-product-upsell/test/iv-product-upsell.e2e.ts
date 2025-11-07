import { newE2EPage } from '@stencil/core/testing';

describe('iv-product-upsell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-product-upsell></iv-product-upsell>');

    const element = await page.find('iv-product-upsell');
    expect(element).toHaveClass('hydrated');
  });
});
