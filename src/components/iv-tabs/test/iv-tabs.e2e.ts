import { newE2EPage } from '@stencil/core/testing';

describe('iv-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-tabs></iv-tabs>');

    const element = await page.find('iv-tabs');
    expect(element).toHaveClass('hydrated');
  });
});
