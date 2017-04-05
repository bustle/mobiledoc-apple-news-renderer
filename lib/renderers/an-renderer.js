import {
  MARKUP_SECTION_TYPE,
  CARD_SECTION_TYPE
} from '../utils/section-types';
import RENDER_TYPE from '../utils/render-type';
import {
  TAG_NAME_TO_AN_ROLE,
  AN_DEFAULT_ARTICLE_LAYOUT,
  AN_DEFAULT_DOCUMENT_STYLE,
  AN_DEFAULT_COMPONENT_TEXT_STYLES,
  AN_NAMED_COMPONENT_LAYOUTS,
  getComponentLayout
} from '../utils/apple-news-utils';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../utils/marker-types';
import {
  isValidSectionTagName,
  isValidMarkerType
} from '../utils/tag-names';
import {
  defaultSectionElementRenderer,
  defaultMarkupElementRenderer
} from '../utils/render-utils';
import { createTextNode } from '../utils/dom';
import {
  reduceAttributes
} from '../utils/sanitization-utils';

const imageCardPayloadToSrc = (payload) => {
  let {key, width, height, ratio, orientation, type} = payload;

  const HOST = "https://typeset-beta.imgix.net";
  let queryParams = {
    w: width,
    fit: 'max',
    h: height,
    auto: 'format',
    q: '70',
    dpr: 2
  };
  let qpString = Object.keys(queryParams).map(key => {
    let val = encodeURIComponent(queryParams[key]);
    key = encodeURIComponent(key);
    return `${key}=${val}`;
  }).join('&');

  let url = `${HOST}/${key}?${qpString}`;
  return url;

  // example:
  // https://typeset-beta.imgix.net/2017/3/15/6733c548-1e3b-471f-99b3-2d6fc4da76b5.jpg?w=614&h=&fit=max&auto=format&q=70&dpr=2
};

function createPhoto({ payload }) {
  let src = imageCardPayloadToSrc(payload);
  let component = {
    role: 'photo',
    URL: src
  };
  return component;
}

// see https://developer.apple.com/library/content/documentation/General/Conceptual/Apple_News_Format_Ref/EmbedVideo.html#//apple_ref/doc/uid/TP40015408-CH15-SW1
function createVideo({ payload }) {
  let { provider_name, url } = payload;
  switch (provider_name) {
    case 'youtube':
    case 'vimeo':
      return { 
        role: 'embedvideo',
        URL: url
      };
    default:
      return createUnknownEmbed({payload});
  }
}

const AN_CARDS = [
  {
    name: 'image-card',
    type: RENDER_TYPE,
    render({payload}) {
      return createPhoto({payload});
    }
  },
  {
    name: 'embed-card',
    type: RENDER_TYPE,
    render({payload}) {
      let { type, provider_name } = payload;
      console.log('embed of type',type,payload);
      switch (type) {
        case 'tweet':
          return createTweet({payload});
        case 'video':
          return createVideo({payload});
        case 'photo':
          switch (provider_name) {
            case 'instagram':
              return createInstagram({payload});
            default:
              return createPhoto({payload});
          }
        default:
          return createUnknownEmbed({payload});
      }
    }
  }
];

// see https://developer.apple.com/library/content/documentation/General/Conceptual/Apple_News_Format_Ref/Tweet.html#//apple_ref/doc/uid/TP40015408-CH37-SW1
function createTweet({payload}) {
  let component = {
    role: 'tweet',
    URL: payload.url
  };
  return component;
}

function createInstagram({payload}) {
  let component = {
    role: 'instagram',
    URL: payload.url
  };
  return component;
}

function createUnknownEmbed({payload}) {
  let component = {
    role: 'body',
    text: `<code>${JSON.stringify(payload)}</code>`,
    format: 'html'
  };
  return component;
}

export default class Renderer {
  constructor(mobiledoc, state) {
    this.mobiledoc = mobiledoc;
    this.state = state;
    let {
      cards,
      unknownCardHandler,
      dom,
      htmlSerializer
    } = state;


    let {
      version,
      sections,
      atoms: atomTypes,
      cards: cardTypes,
      markups: markerTypes
    } = mobiledoc;
    this.cardTypes          = cardTypes;
    this.cards = AN_CARDS;
    this.markerTypes        = markerTypes;
    this.sections = sections;

    this.dom = dom || new SimpleDOM.Document();
    this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;
    this.htmlSerializer = htmlSerializer || (new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap));
  }

  render() {
    let components = this.renderSections();

    // add default layouts
    components = components.map(component => {
      return { ...component, layout: getComponentLayout(component) }
    });

    return {
      result: {
        version: "1.0",
        identifier: "Apple_Demo",
        title: "Simplest",
        language: "en",
        layout: AN_DEFAULT_ARTICLE_LAYOUT,
        documentStyle: AN_DEFAULT_DOCUMENT_STYLE,
        components,
        componentTextStyles: AN_DEFAULT_COMPONENT_TEXT_STYLES,
        componentLayouts: AN_NAMED_COMPONENT_LAYOUTS
      }
    };
  }

  renderSections() {
    return this.sections.map(s => this.renderSection(s)).
      filter(res => !!res);
  }

  renderSection(section) {
    let [type] = section;
    switch (type) {
      case MARKUP_SECTION_TYPE:
        return this.renderMarkupSection(section);
      case CARD_SECTION_TYPE:
        return this.renderCardSection(section);
    }
  }

  renderCardSection([type, index]) {
    let { card, payload } = this._findCardByIndex(index);
    let cardArg = this._createCardArgument(card, payload);
    let component = card.render(cardArg);
    return component;
  }

  _createCardArgument(card, payload={}) {
    let env = {
      name: card.name,
      isInEditor: false,
      dom: this.dom,
      didRender: (callback) => this._registerRenderCallback(callback),
      onTeardown: (callback) => this._registerTeardownCallback(callback)
    };

    let options = this.cardOptions;

    return { env, options, payload };
  }


  _findCardByIndex(index) {
    let cardType = this.cardTypes[index];
    if (!cardType) {
      throw new Error(`No card definition found at index ${index}`);
    }

    let [ name, payload ] = cardType;
    let card = this.findCard(name);

    return {
      card,
      payload
    };
  }

  findCard(name) {
    for (let i=0; i < this.cards.length; i++) {
      if (this.cards[i].name === name) {
        return this.cards[i];
      }
    }
    return this._createUnknownCard(name);
  }

  _createUnknownCard(name) {
    return {
      name,
      type: RENDER_TYPE,
      render: this.unknownCardHandler
    };
  }

  get _defaultUnknownCardHandler() {
    return ({env: {name}}) => {
      throw new Error(`Card "${name}" not found but no unknownCardHandler was registered`);
    };
  }

  renderMarkupSection(section) {
    let [type, tagName, markers] = section;
    tagName = tagName.toLowerCase();

    let html = this.renderMarkersToHTML(markers);
    console.log('tagName',tagName);
    let component = {
      role: TAG_NAME_TO_AN_ROLE[tagName] || TAG_NAME_TO_AN_ROLE.__default__,
      text: html,
      format: 'html'
    };
    return component;
  }

  /**
   * @return {string} html
   */
  renderMarkersToHTML(markers) {
    let currentElement = this.dom.createElement('p');
    let elements = [currentElement];

    let pushElement = (openedElement) => {
      currentElement.appendChild(openedElement);
      elements.push(openedElement);
      currentElement = openedElement;
    };

    for (let i=0, l=markers.length; i<l; i++) {
      let marker = markers[i];
      let [type, openTypes, closeCount, value] = marker;

      for (let j=0, m=openTypes.length; j<m; j++) {
        let markerType = this.markerTypes[openTypes[j]];
        let [tagName, attrs=[]] = markerType;

        if (isValidMarkerType(tagName)) {
          pushElement(this.renderMarkupElement(tagName, attrs));
        } else {
          closeCount--;
        }
      }

      switch (type) {
        case MARKUP_MARKER_TYPE:
          currentElement.appendChild(createTextNode(this.dom, value));
          break;
        case ATOM_MARKER_TYPE:
          currentElement.appendChild(this._renderAtom(value));
          break;
        default:
          throw new Error(`Unknown markup type (${type})`);
      }

      for (let j=0, m=closeCount; j<m; j++) {
        elements.pop();
        currentElement = elements[elements.length - 1];
      }
    }

    let serializer = this.htmlSerializer;
    return serializer.serializeChildren(currentElement);
  }

  renderMarkupElement(tagName, attrs) {
    tagName = tagName.toLowerCase();
    attrs   = reduceAttributes(attrs);

    let renderer = defaultMarkupElementRenderer;
    return renderer(tagName, this.dom, attrs);
  }
}
