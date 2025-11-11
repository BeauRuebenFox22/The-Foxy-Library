import { newSpecPage } from '@stencil/core/testing';
import { IvEventButton } from '../iv-event-button';

describe('iv-event-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IvEventButton],
      html: `<iv-event-button></iv-event-button>`,
    });
    expect(page.root).toEqualHtml(`
      <iv-event-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </iv-event-button>
    `);
  });
});
