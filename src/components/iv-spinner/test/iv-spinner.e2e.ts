import { newE2EPage } from '@stencil/core/testing';

describe('iv-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-spinner></iv-spinner>');

    const element = await page.find('iv-spinner');
    expect(element).toHaveClass('hydrated');
  });
});
