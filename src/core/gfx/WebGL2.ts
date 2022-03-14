import { $ } from '@Loop/utils/dom';
import assert from '@Loop/utils/assert';

// Initialize WebGL2
export default (() => {
  let canvas = $<HTMLCanvasElement>('#glCanvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    document.body.append(canvas);
  }

  // Initialize the GL context
  const ctx = canvas.getContext('webgl2');

  // Only continue if WebGL is available and working
  assert(ctx, 'Failed to initialize WebGL');

  const resizeViewport = () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.viewport(0, 0, window.innerWidth, window.innerHeight);
  };

  resizeViewport();
  window.addEventListener('resize', resizeViewport);

  return ctx;
})();
