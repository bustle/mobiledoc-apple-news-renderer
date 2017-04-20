import {
  MARKUP_SECTION_TYPE,
  CARD_SECTION_TYPE
} from '../utils/section-types';
import RENDER_TYPE from '../utils/render-type';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../utils/marker-types';
import {
  isValidMarkerType
} from '../utils/tag-names';
import {
  defaultMarkupElementRenderer
} from '../utils/render-utils';
import { createTextNode } from '../utils/dom';
import {
  reduceAttributes
} from '../utils/sanitization-utils';
import {
  MOBILEDOC_VERSION_0_3_0,
  MOBILEDOC_VERSION_0_3_1
} from '../utils/mobiledoc-versions';

import {
  TAG_NAME_TO_AN_ROLE,
  AN_DEFAULT_VALUES
} from '../utils/apple-news';

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
      // atoms: atomTypes,
      cards: cardTypes,
      markups: markerTypes
    } = mobiledoc;
    this.cardTypes          = cardTypes;
    this.cards = cards;
    this.markerTypes        = markerTypes;
    this.sections = sections;

    switch (version) {
      case MOBILEDOC_VERSION_0_3_0:
      case MOBILEDOC_VERSION_0_3_1:
        // these versions are supported
        break;
      default:
        throw new Error('Unsupported mobiledoc version: ' + version);
    }

    if (!dom) {
      throw new Error('Must pass `dom` to renderer');
    }
    this.dom = dom;

    if (!htmlSerializer) {
      throw new Error('Must pass `htmlSerializer` to renderer');
    }
    this.htmlSerializer = htmlSerializer;

    this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;
  }

  render() {
    let components = this.renderSections();

    let article = {components};
    Object.keys(AN_DEFAULT_VALUES).forEach(key => article[key] = AN_DEFAULT_VALUES[key]);
    return { result: article };
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
    this._assertValidComponent(component, card);
    return component;
  }

  _assertValidComponent(component, card) {
    if (!component.role) {
      throw new Error(`Card "${card.name}" did not return component with "role" property`);
    }
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
    let [type, tagName, markers] = section; // jshint ignore:line
    tagName = tagName.toLowerCase();

    let html = this.renderMarkersToHTML(markers);
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

    return this.htmlSerializer(currentElement);
  }

  renderMarkupElement(tagName, attrs) {
    tagName = tagName.toLowerCase();
    attrs   = reduceAttributes(attrs);

    let renderer = defaultMarkupElementRenderer;
    return renderer(tagName, this.dom, attrs);
  }
}
