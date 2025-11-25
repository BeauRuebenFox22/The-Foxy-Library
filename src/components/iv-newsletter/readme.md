# iv-newsletter



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                   | Description | Type                                                     | Default       |
| --------------------------- | --------------------------- | ----------- | -------------------------------------------------------- | ------------- |
| `formdescriptiontext`       | `formdescriptiontext`       |             | `string`                                                 | `undefined`   |
| `formfailuremessage`        | `formfailuremessage`        |             | `string`                                                 | `undefined`   |
| `formimageheight`           | `formimageheight`           |             | `string`                                                 | `undefined`   |
| `formimageposition`         | `formimageposition`         |             | `"cover" \| "top"`                                       | `undefined`   |
| `formimageurl`              | `formimageurl`              |             | `string`                                                 | `undefined`   |
| `formlabeltext`             | `formlabeltext`             |             | `string`                                                 | `undefined`   |
| `formplaceholdertext`       | `formplaceholdertext`       |             | `string`                                                 | `undefined`   |
| `formstackbutton`           | `formstackbutton`           |             | `boolean`                                                | `false`       |
| `formsubmitbtntext`         | `formsubmitbtntext`         |             | `string`                                                 | `'Subscribe'` |
| `formsuccessmessage`        | `formsuccessmessage`        |             | `string`                                                 | `undefined`   |
| `formtitletag`              | `formtitletag`              |             | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "span"` | `'h2'`        |
| `formtitletext`             | `formtitletext`             |             | `string`                                                 | `undefined`   |
| `includeloadingspinner`     | `includeloadingspinner`     |             | `boolean`                                                | `true`        |
| `newsletterpopupdisclaimer` | `newsletterpopupdisclaimer` |             | `string`                                                 | `undefined`   |


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
