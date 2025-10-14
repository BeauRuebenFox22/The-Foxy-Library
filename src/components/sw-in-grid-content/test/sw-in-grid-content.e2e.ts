import { newE2EPage } from '@stencil/core/testing';

describe('sw-in-grid-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sw-in-grid-content></sw-in-grid-content>');

    const element = await page.find('sw-in-grid-content');
    expect(element).toHaveClass('hydrated');
  });
});
