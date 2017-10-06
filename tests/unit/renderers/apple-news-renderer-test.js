/* global QUnit, SimpleDOM */
import Renderer, { RENDER_TYPE } from 'mobiledoc-apple-news-renderer';

import {
  TAG_NAME_TO_AN_ROLE,
  AN_DEFAULT_VALUES
} from 'mobiledoc-apple-news-renderer/utils/apple-news';

import {
  createBlankMobiledoc,
  createSimpleMobiledoc,
  createMobiledocWithCard
} from '../../helpers/create-mobiledoc';

const { test, module } = QUnit;

let render = (mobiledoc, {cards}={cards:[]}) => {
  let dom = new SimpleDOM.Document();
  let htmlSerializer = (element) => {
    return new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap).
      serializeChildren(element);
  };

  return new Renderer(mobiledoc, {
    cards, dom, htmlSerializer
  }).render();
};

module('Unit: Mobiledoc Apple News Renderer', {
});

test('it exists', function(assert) {
  assert.ok(!!Renderer);
});

test('blank mobiledoc', function(assert) {
  let rendered = render(createBlankMobiledoc());
  let { result: article } = rendered;

  Object.keys(AN_DEFAULT_VALUES).forEach(key => {
    assert.ok( !!article[key], `article has default property "${key}"`);
  });

  let { components } = article;

  assert.equal(components.length, 0, 'no components');
});

test('simple, default mobiledoc', function(assert) {
  let text = 'Apple News';
  let rendered = render(createSimpleMobiledoc({text}));
  let { result: {components} } = rendered;

  assert.equal(components.length, 1);
  let [component] = components;

  assert.equal(component.role, 'body');
  assert.equal(component.format, 'html');
  assert.equal(component.text, text);
});

test('simple mobiledoc with different section tag names', function(assert) {
  let text = 'Apple News';

  Object.keys(TAG_NAME_TO_AN_ROLE).forEach(tagName => {
    let expectedRole = TAG_NAME_TO_AN_ROLE[tagName];

    let rendered = render(createSimpleMobiledoc({
      text, sectionName: tagName
    }));

    let { result: {components} } = rendered;

    assert.equal(components.length, 1);
    let [component] = components;

    assert.equal(component.role, expectedRole, `correct role for tagName "${tagName}"`);
    assert.equal(component.format, 'html', `correct format for tagName "${tagName}"`);
    assert.equal(component.text, text, `correct text for tagName "${tagName}"`);
  });
});

test('mobiledoc with html', function(assert) {
  let text = 'test text';
  let markup = ['b'];

  let rendered = render(createSimpleMobiledoc({text, markup}));
  let { result: {components} } = rendered;

  assert.equal(components.length, 1);
  assert.equal(components[0].text, '<b>test text</b>');
});

test('mobiledoc with cards', function(assert) {
  let component = {
    role: 'body',
    text: 'test card'
  };

  let cardName = 'test-card';
  let card = {
    name: cardName,
    type: RENDER_TYPE,
    render() {
      return component;
    }
  };

  let mobiledoc = createMobiledocWithCard({card: {name: cardName}});
  let rendered = render(mobiledoc, {cards: [card]});
  let { result: {components} } = rendered;
  assert.equal(components.length, 1);
  assert.deepEqual(components[0], component);
});

test('mobiledoc with cards throws on invalid return value', function(assert) {
  let cardName = 'test-card';
  let card = {
    name: cardName,
    type: RENDER_TYPE,
    render() {
      return { text: 'invalid component' };
    }
  };

  let mobiledoc = createMobiledocWithCard({card: {name: cardName}});
  assert.throws(() => {
    let rendered = render(mobiledoc, {cards: [card]}); // jshint ignore:line
  }, /"role" property/);
});

test('mobiledoc with empty section is not included in Apple News output', function(assert) {
  let mobiledoc = createSimpleMobiledoc({text: ''});
  let rendered = render(mobiledoc);
  let { result: { components } } = rendered;
  assert.equal(components.length, 0, 'empty section is not included in component output');
});

test('mobiledoc with blank string is not included in Apple News output', function(assert) {
  let mobiledoc = createSimpleMobiledoc({text: '   '});
  let rendered = render(mobiledoc);
  let { result: { components } } = rendered;
  assert.equal(components.length, 0, 'empty section is not included in component output');
});
