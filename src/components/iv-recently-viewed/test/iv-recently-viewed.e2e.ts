import { newE2EPage } from '@stencil/core/testing';

describe('iv-recently-viewed', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-recently-viewed></iv-recently-viewed>');

    const element = await page.find('iv-recently-viewed');
    expect(element).toHaveClass('hydrated');
  });
});
