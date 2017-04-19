## Mobiledoc Apple News Renderer

Renders mobiledoc to an array of apple news components.

The mapping in `lib/utils/apple-news-utils` is used to map mobiledoc sections to
Apple News component roles.

### Usage

Must pass an `htmlSerializer` property to the renderer, as
well as a `dom` property.

`htmlSerializer` is a function that will be called with a DOM (or SimpleDOM) element
and it will return the serialized HTML as a string.

### Publishing

Before publishing run `npm run build` to generate the transpiled files in
`dist/`
