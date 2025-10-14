import { newE2EPage } from '@stencil/core/testing';

describe('iv-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-accordion></iv-accordion>');

    const element = await page.find('iv-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
