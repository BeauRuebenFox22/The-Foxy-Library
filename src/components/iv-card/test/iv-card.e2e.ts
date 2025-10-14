import { newE2EPage } from '@stencil/core/testing';

describe('iv-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-card></iv-card>');

    const element = await page.find('iv-card');
    expect(element).toHaveClass('hydrated');
  });
});
