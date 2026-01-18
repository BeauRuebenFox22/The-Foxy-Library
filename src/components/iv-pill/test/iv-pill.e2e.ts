import { newE2EPage } from '@stencil/core/testing';

describe('iv-pill', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-pill></iv-pill>');

    const element = await page.find('iv-pill');
    expect(element).toHaveClass('hydrated');
  });
});
