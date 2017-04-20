## Mobiledoc Apple News Renderer

Renders mobiledoc to an array of apple news components. Supports mobiledoc
version 0.3.0 and later. Supports Apple News format 1.4.

[Apple News Format 1.0
Reference](https://developer.apple.com/library/content/documentation/General/Conceptual/Apple_News_Format_Ref/index.html#//apple_ref/doc/uid/TP40015408-CH102-SW1)

The mapping in `lib/utils/apple-news` is used to map mobiledoc section tag names
to Apple News component roles.

The renderer returns an render result that is a fully-realized (albeit
unstyled) article.json. The article's components correspond to the rendered
sections of the mobiledoc.

### Usage

Must pass an `htmlSerializer` property to the renderer, as
well as a `dom` property.

`htmlSerializer` is a function that will be called with a DOM (or SimpleDOM) element
and it will return the serialized HTML as a string.

Example:

```javascript
import Renderer from 'mobiledoc-apple-news-renderer';
import SimpleDOM from 'simple-dom';

let renderer = new Renderer(mobiledoc, {
  cards: [],
  dom: new SimpleDOM.Document(),
  htmlSerializer: (element) => {
    return new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap).
             serializeChildren(element);
  }
});

let rendered = renderer.render();
let article = rendered.result;
/*
   article: {
     version: '1.0',
     title: 'Default Title',
     layout: {},
     ... other Apple News default properties
     components: [
       {
         role: 'body',
         format: 'html',
         text: 'The rendered HTML of the first mobiledoc section...'
       },
       ...
     ]
   }
 */
```

### Publishing

Before publishing run `npm run build` to generate the transpiled files in
`dist/`
