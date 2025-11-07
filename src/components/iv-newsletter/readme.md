# iv-newsletter



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description | Type                                                     | Default       |
| ----------------------- | ------------------------- | ----------- | -------------------------------------------------------- | ------------- |
| `formDescriptionText`   | `form-description-text`   |             | `string`                                                 | `undefined`   |
| `formFailureMessage`    | `form-failure-message`    |             | `string`                                                 | `undefined`   |
| `formLabelText`         | `form-label-text`         |             | `string`                                                 | `undefined`   |
| `formPlaceholderText`   | `form-placeholder-text`   |             | `string`                                                 | `undefined`   |
| `formStackButton`       | `form-stack-button`       |             | `boolean`                                                | `undefined`   |
| `formSubmitBtnText`     | `form-submit-btn-text`    |             | `string`                                                 | `'Subscribe'` |
| `formSuccessMessage`    | `form-success-message`    |             | `string`                                                 | `undefined`   |
| `formTitleTag`          | `form-title-tag`          |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "span"` | `'h2'`        |
| `formTitleText`         | `form-title-text`         |             | `string`                                                 | `undefined`   |
| `includeLoadingSpinner` | `include-loading-spinner` |             | `boolean`                                                | `undefined`   |


## Events

| Event               | Description | Type                                   |
| ------------------- | ----------- | -------------------------------------- |
| `newsletterFail`    |             | `CustomEvent<NewsletterFailDetail>`    |
| `newsletterSuccess` |             | `CustomEvent<NewsletterSuccessDetail>` |


## Dependencies

### Depends on

- [iv-spinner](../iv-spinner)

### Graph
```mermaid
graph TD;
  iv-newsletter --> iv-spinner
  style iv-newsletter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
