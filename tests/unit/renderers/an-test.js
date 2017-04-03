/* global QUnit, SimpleDOM */

const { test, module } = QUnit;

import SampleMobiledoc from '../../helpers/mobiledoc-fixtures';
import ANRenderer from 'mobiledoc-dom-renderer/renderers/an-renderer';

module('Unit: AN Renderer');

test('output is sane', (assert) => {
  let { result, teardown } = new ANRenderer(SampleMobiledoc, {
  }).render();

  console.log(result);
});
