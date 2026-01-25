import { newE2EPage } from '@stencil/core/testing';

describe('iv-age-verify', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-age-verify></iv-age-verify>');

    const element = await page.find('iv-age-verify');
    expect(element).toHaveClass('hydrated');
  });
});
