import { newE2EPage } from '@stencil/core/testing';

describe('iv-carousel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-carousel></iv-carousel>');

    const element = await page.find('iv-carousel');
    expect(element).toHaveClass('hydrated');
  });
});
