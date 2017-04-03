import RendererFactory from './renderer-factory';
import RENDER_TYPE from './utils/render-type';
import ANRenderer from './renderers/an-renderer';

export { RENDER_TYPE, ANRenderer };

export function registerGlobal(window) {
  window.MobiledocDOMRenderer = RendererFactory;
}

export default RendererFactory;
