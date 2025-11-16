import { newE2EPage } from '@stencil/core/testing';

describe('iv-compare-product', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-compare-product></iv-compare-product>');

    const element = await page.find('iv-compare-product');
    expect(element).toHaveClass('hydrated');
  });
});
