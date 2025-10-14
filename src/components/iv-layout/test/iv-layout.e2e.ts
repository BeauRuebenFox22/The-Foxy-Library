import { newE2EPage } from '@stencil/core/testing';

describe('iv-layout', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-layout></iv-layout>');

    const element = await page.find('iv-layout');
    expect(element).toHaveClass('hydrated');
  });
});
