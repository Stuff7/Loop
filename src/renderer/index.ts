import gl from '@Loop/core/gfx/WebGL2';
import { getDebugDialog, getFPSCounter } from '@Loop/ui';
import VertexArray from './VertexArray';

export default class Renderer {
  private static m_VAOs: VertexArray[] = [];

  private static FPSCounter = getFPSCounter('fps-counter');
  private static Debug = getDebugDialog('debug');

  static s_Constructor = (() => {
    gl.clearColor(1.0, 0.0, 1.0, 1.0); // #F0FF
    gl.clearDepth(1.0);                // Clear everything
    gl.enable(gl.DEPTH_TEST);          // Enable depth testing
    gl.depthFunc(gl.LEQUAL);           // Near things obscure far things

    this.Debug.setOutput({
      GLRenderer: gl.getParameter(gl.RENDERER),
      GLVersion: gl.getParameter(gl.VERSION),
      GLVendor: gl.getParameter(gl.VENDOR),
    });
  })();

  static draw(timestamp = 0) {
    requestAnimationFrame(this.draw.bind(this));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.FPSCounter.setTimestamp(timestamp);
    this.m_VAOs.forEach(vao => vao.draw());
  }

  static submit(vao: VertexArray) {
    this.m_VAOs.push(vao);
  }
}
