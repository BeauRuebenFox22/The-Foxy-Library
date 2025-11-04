import { newE2EPage } from '@stencil/core/testing';

describe('iv-newsletter', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-newsletter></iv-newsletter>');

    const element = await page.find('iv-newsletter');
    expect(element).toHaveClass('hydrated');
  });
});
