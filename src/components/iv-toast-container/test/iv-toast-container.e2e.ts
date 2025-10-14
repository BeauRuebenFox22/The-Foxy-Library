import { newE2EPage } from '@stencil/core/testing';

describe('iv-toast-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-toast-container></iv-toast-container>');

    const element = await page.find('iv-toast-container');
    expect(element).toHaveClass('hydrated');
  });
});
