import { newE2EPage } from '@stencil/core/testing';

describe('iv-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-footer></iv-footer>');

    const element = await page.find('iv-footer');
    expect(element).toHaveClass('hydrated');
  });
});
