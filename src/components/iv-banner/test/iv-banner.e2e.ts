import { newE2EPage } from '@stencil/core/testing';

describe('iv-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-banner></iv-banner>');

    const element = await page.find('iv-banner');
    expect(element).toHaveClass('hydrated');
  });
});
