# iv-dynamic-products-carousel



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute          | Description | Type                                                                               | Default               |
| ------------------ | ------------------ | ----------- | ---------------------------------------------------------------------------------- | --------------------- |
| `addtocarttext`    | `addtocarttext`    |             | `string`                                                                           | `undefined`           |
| `buttontext`       | `buttontext`       |             | `string`                                                                           | `undefined`           |
| `cachettl`         | `cachettl`         |             | `number`                                                                           | `undefined`           |
| `calltoaction`     | `calltoaction`     |             | `boolean`                                                                          | `false`               |
| `collectionhandle` | `collectionhandle` |             | `string`                                                                           | `'all'`               |
| `componenttitle`   | `componenttitle`   |             | `string`                                                                           | `undefined`           |
| `emptystring`      | `emptystring`      |             | `string`                                                                           | `'No products found'` |
| `excluse`          | `excluse`          |             | `string`                                                                           | `undefined`           |
| `limit`            | `limit`            |             | `number`                                                                           | `24`                  |
| `requestedfields`  | `requestedfields`  |             | `string`                                                                           | `undefined`           |
| `reversed`         | `reversed`         |             | `boolean`                                                                          | `false`               |
| `stale`            | `stale`            |             | `boolean`                                                                          | `true`                |
| `titletag`         | `titletag`         |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"`                                     | `'h2'`                |
| `type`             | `type`             |             | `"BEST_SELLING" \| "CREATED" \| "CREATED_AT" \| "PRICE" \| "RELEVANCE" \| "TITLE"` | `'CREATED_AT'`        |


## Dependencies

### Depends on

- [iv-spinner](../iv-spinner)
- [iv-card](../iv-card)

### Graph
```mermaid
graph TD;
  iv-dynamic-products-carousel --> iv-spinner
  iv-dynamic-products-carousel --> iv-card
  iv-card --> iv-button
  iv-card --> iv-link
  style iv-dynamic-products-carousel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
