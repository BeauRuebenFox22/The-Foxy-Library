import { newE2EPage } from '@stencil/core/testing';

describe('iv-event-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<iv-event-button></iv-event-button>');

    const element = await page.find('iv-event-button');
    expect(element).toHaveClass('hydrated');
  });
});
