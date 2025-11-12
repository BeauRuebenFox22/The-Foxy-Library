# iv-sidebar



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                   | Description | Type                            | Default     |
| --------------------------- | --------------------------- | ----------- | ------------------------------- | ----------- |
| `newsletterpopupdisclaimer` | `newsletterpopupdisclaimer` |             | `string`                        | `undefined` |
| `newsletterpopupimage`      | `newsletterpopupimage`      |             | `string`                        | `undefined` |
| `newsletterpopuptext`       | `newsletterpopuptext`       |             | `string`                        | `undefined` |
| `newsletterpopuptimedelay`  | `newsletterpopuptimedelay`  |             | `number`                        | `undefined` |
| `newsletterpopuptitle`      | `newsletterpopuptitle`      |             | `string`                        | `undefined` |
| `newsletterpopuptrigger`    | `newsletterpopuptrigger`    |             | `"exit_intent" \| "time_delay"` | `undefined` |


## Dependencies

### Depends on

- [iv-button](../iv-button)
- [iv-wishlist-view](../iv-wishlist-view)

### Graph
```mermaid
graph TD;
  iv-sidebar --> iv-button
  iv-sidebar --> iv-wishlist-view
  iv-wishlist-view --> iv-button
  style iv-sidebar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
