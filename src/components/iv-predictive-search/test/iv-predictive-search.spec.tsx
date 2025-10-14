import { newSpecPage } from '@stencil/core/testing';
import { IvPredictiveSearch } from '../iv-predictive-search';

describe('iv-predictive-search', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvPredictiveSearch],
      html: `<iv-predictive-search></iv-predictive-search>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-predictive-search>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-predictive-search>
    `);
  });
});
