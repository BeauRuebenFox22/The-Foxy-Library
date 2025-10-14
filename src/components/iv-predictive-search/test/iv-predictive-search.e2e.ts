import { newE2EPage } from '@stencil/core/testing';

describe('iv-predictive-search', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-predictive-search></iv-predictive-search>');

    const element = await page.find('iv-predictive-search');
    expect(element).toHaveClass('hydrated');
  });
});
