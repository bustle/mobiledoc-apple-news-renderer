/* global QUnit, SimpleDOM */

import Renderer, { RENDER_TYPE } from 'mobiledoc-apple-news-renderer';
import {
  createBlankMobiledoc,
  createSimpleMobiledoc,
  createMobiledocWithCard,
  createMobiledocWithAtom
} from '../../helpers/create-mobiledoc';

const { test, module } = QUnit;
import {
  MOBILEDOC_VERSION_0_3_0,
  MOBILEDOC_VERSION_0_3_1
} from 'mobiledoc-apple-news-renderer/utils/mobiledoc-versions';
const MOBILEDOC_VERSION = MOBILEDOC_VERSION_0_3_1;

module('Unit: Mobiledoc Apple News Renderer', {
});

test('it exists', function(assert) {
  assert.ok(!!Renderer);
});
