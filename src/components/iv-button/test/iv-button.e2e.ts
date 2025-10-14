import { newE2EPage } from '@stencil/core/testing';

describe('iv-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-button></iv-button>');

    const element = await page.find('iv-button');
    expect(element).toHaveClass('hydrated');
  });
});
