import { newE2EPage } from '@stencil/core/testing';

describe('sw-size-guide', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sw-size-guide></sw-size-guide>');

    const element = await page.find('sw-size-guide');
    expect(element).toHaveClass('hydrated');
  });
});
