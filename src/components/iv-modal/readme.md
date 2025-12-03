# iv-modal



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                  | Description | Type                            | Default     |
| -------------------------- | -------------------------- | ----------- | ------------------------------- | ----------- |
| `newsletterpopuptimedelay` | `newsletterpopuptimedelay` |             | `number`                        | `undefined` |
| `newsletterpopuptrigger`   | `newsletterpopuptrigger`   |             | `"exit_intent" \| "time_delay"` | `undefined` |


## Dependencies

### Depends on

- [iv-button](../iv-button)
- [iv-wishlist-view](../iv-wishlist-view)

### Graph
```mermaid
graph TD;
  iv-modal --> iv-button
  iv-modal --> iv-wishlist-view
  iv-wishlist-view --> iv-button
  style iv-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
