import { newE2EPage } from '@stencil/core/testing';

describe('iv-icon-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-icon-list></iv-icon-list>');

    const element = await page.find('iv-icon-list');
    expect(element).toHaveClass('hydrated');
  });
});
