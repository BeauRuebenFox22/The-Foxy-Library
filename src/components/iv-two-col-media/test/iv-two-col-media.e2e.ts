import { newE2EPage } from '@stencil/core/testing';

describe('iv-two-col-media', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-two-col-media></iv-two-col-media>');

    const element = await page.find('iv-two-col-media');
    expect(element).toHaveClass('hydrated');
  });
});
