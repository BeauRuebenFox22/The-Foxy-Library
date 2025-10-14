import { newE2EPage } from '@stencil/core/testing';

describe('iv-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-link></iv-link>');

    const element = await page.find('iv-link');
    expect(element).toHaveClass('hydrated');
  });
});
