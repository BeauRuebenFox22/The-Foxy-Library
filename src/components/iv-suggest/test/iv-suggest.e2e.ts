import { newE2EPage } from '@stencil/core/testing';

describe('iv-suggest', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-suggest></iv-suggest>');

    const element = await page.find('iv-suggest');
    expect(element).toHaveClass('hydrated');
  });
});
