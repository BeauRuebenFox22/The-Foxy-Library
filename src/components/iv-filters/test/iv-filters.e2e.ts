import { newE2EPage } from '@stencil/core/testing';

describe('iv-filters', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-filters></iv-filters>');

    const element = await page.find('iv-filters');
    expect(element).toHaveClass('hydrated');
  });
});
