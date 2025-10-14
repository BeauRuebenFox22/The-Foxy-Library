# iv-card



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description | Type                    | Default     |
| --------------- | --------------- | ----------- | ----------------------- | ----------- |
| `addtocarttext` | `addtocarttext` |             | `string`                | `undefined` |
| `buttontext`    | `buttontext`    |             | `string`                | `undefined` |
| `calltoaction`  | `calltoaction`  |             | `boolean`               | `false`     |
| `cardtype`      | `cardtype`      |             | `string`                | `undefined` |
| `classmodifier` | `classmodifier` |             | `string`                | `undefined` |
| `data`          | --              |             | `{ [x: string]: any; }` | `undefined` |
| `fields`        | `fields`        |             | `string`                | `undefined` |


## Dependencies

### Used by

 - [iv-dynamic-products](../iv-dynamic-products)
 - [iv-dynamic-products-carousel](../iv-dynamic-products-carousel)
 - [iv-recently-viewed](../iv-recently-viewed)
 - [iv-suggest](../iv-suggest)

### Depends on

- [iv-button](../iv-button)
- [iv-link](../iv-link)

### Graph
```mermaid
graph TD;
  iv-card --> iv-button
  iv-card --> iv-link
  iv-dynamic-products --> iv-card
  iv-dynamic-products-carousel --> iv-card
  iv-recently-viewed --> iv-card
  iv-suggest --> iv-card
  style iv-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
