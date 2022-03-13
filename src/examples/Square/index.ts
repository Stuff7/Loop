import gl from '@Loop/core/gfx/WebGL2';
import Shader from '@Loop/renderer/Shader';
import vertexShader from './shader.vert?raw';
import fragmentShader from './shader.frag?raw';
import { getFPSCounter, getDebugDialog } from '@Loop/ui';
import { mat4 } from 'gl-matrix';
import { VertexBuffer } from '@Loop/renderer/Buffer';

const FPSCounter = getFPSCounter('fps-counter');
const Debug = getDebugDialog('debug');

Debug.setOutput({
  GLRenderer: gl.getParameter(gl.RENDERER),
  GLVersion: gl.getParameter(gl.VERSION),
  GLVendor: gl.getParameter(gl.VENDOR),
});

export default class Square {
  buffers: ReturnType<typeof this.initBuffers>;
  shader: Shader;

  constructor() {
    this.buffers = this.initBuffers();
    this.shader = new Shader(vertexShader, fragmentShader);
    this.shader.bind();
  }

  draw(timestamp = 0) {
    requestAnimationFrame(this.draw.bind(this));
    FPSCounter.setTimestamp(timestamp);
    const { buffers } = this;

    /* REFRESH */
    gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* MATRICES */
    // Create a perspective matrix
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(
      projectionMatrix, // Destination to receive the result
      fieldOfView,
      aspect,
      zNear,
      zFar,
    );

    // Set drawing position to the "identity" point (center of the scene).
    const modelViewMatrix = mat4.create();

    // Move drawing position to where we want to start drawing the square.
    mat4.translate(
      modelViewMatrix,    // destination matrix
      modelViewMatrix,    // matrix to translate
      [-0.0, 0.0, -6.0],  // amount to translate
    );

    /* BUFFERS */
    // Pull out the positions from the position buffer into the vertexPosition attribute.
    {
      buffers.position.bind();

      gl.vertexAttribPointer(
        this.shader.getAttribLocation('aVertexPosition'),
        2,         // pull out 2 values per iteration
        gl.FLOAT,  // the data in the buffer is 32bit floats
        false,     // don't normalize
        0,         // 0 = 2 * gl.FLOAT
        0,         // how many bytes inside the buffer to start from
      );
      gl.enableVertexAttribArray(
        this.shader.getAttribLocation('aVertexPosition'),
      );
      // Set the shader uniforms
      this.shader.uploadUniformMat4('uProjectionMatrix', projectionMatrix);
      this.shader.uploadUniformMat4('uModelViewMatrix', modelViewMatrix);
    }

    // Pull out the colors from the color buffer into the vertexColor attribute.
    {
      buffers.color.bind();

      gl.vertexAttribPointer(
        this.shader.getAttribLocation('aVertexColor'),
        4, gl.FLOAT, false, 0, 0,
      );
      gl.enableVertexAttribArray(
        this.shader.getAttribLocation('aVertexColor'),
      );
    }

    /* DRAW */
    // 0 = offset, 4 = vertices
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  initBuffers() {
    const positionBuffer = new VertexBuffer([
      1.0,  1.0,
     -1.0,  1.0,
      1.0, -1.0,
     -1.0, -1.0,
    ]);

    const colorBuffer = new VertexBuffer([
      1.0,  1.0,  1.0,  1.0, // white
      1.0,  0.0,  0.0,  1.0, // red
      0.0,  1.0,  0.0,  1.0, // green
      0.0,  0.0,  1.0,  1.0, // blue
    ]);

    return {
      position: positionBuffer,
      color: colorBuffer,
    };
  }
}
