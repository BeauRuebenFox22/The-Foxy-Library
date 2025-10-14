import { newE2EPage } from '@stencil/core/testing';

describe('iv-dynamic-products', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-dynamic-products></iv-dynamic-products>');

    const element = await page.find('iv-dynamic-products');
    expect(element).toHaveClass('hydrated');
  });
});
