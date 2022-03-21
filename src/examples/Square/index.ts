import gl from '@Loop/core/gfx/WebGL2';
import Shader from '@Loop/Renderer/Shader';
import vertexShader from './shader.vert?raw';
import fragmentShader from './shader.frag?raw';
import VertexArray from '@Loop/Renderer/VertexArray';
import { getFPSCounter, getDebugDialog } from '@Loop/ui';
import { mat4 } from 'gl-matrix';
import { VertexBuffer, ShaderDataType, IndexBuffer } from '@Loop/Renderer/Buffer';

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
  perspectiveOptions;
  projectionMatrix = mat4.create();
  modelViewMatrix = mat4.create();

  constructor() {
    this.shader = new Shader(vertexShader, fragmentShader);
    this.shader.bind();
    this.buffers = this.initBuffers();

    /* REFRESH */
    gl.clearColor(0.1, 0.1, 0.1, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    this.perspectiveOptions = {
      fieldOfView: 45 * Math.PI / 180,
      aspect: () => gl.canvas.clientWidth / gl.canvas.clientHeight,
      zNear: 0.1,
      zFar: 100.0,
    };
  }

  draw(timestamp = 0) {
    requestAnimationFrame(this.draw.bind(this));
    FPSCounter.setTimestamp(timestamp);

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      this.projectionMatrix, // destination matrix
      this.perspectiveOptions.fieldOfView,
      this.perspectiveOptions.aspect(),
      this.perspectiveOptions.zNear,
      this.perspectiveOptions.zFar,
    );

    // Set drawing position to the "identity" point (center of the scene).
    this.modelViewMatrix = mat4.create();

    // Move drawing position to where we want to start drawing the square.
    mat4.translate(
      this.modelViewMatrix,    // destination matrix
      this.modelViewMatrix,    // matrix to translate
      [-0.0, 0.0, -6.0],  // amount to translate
    );

    /* BUFFERS */
    // Pull out the positions from the position buffer into the vertexPosition attribute.
    // Set the shader uniforms
    this.shader.uploadUniformMat4('uProjectionMatrix', this.projectionMatrix);
    this.shader.uploadUniformMat4('uModelViewMatrix', this.modelViewMatrix);

    this.buffers.draw();
  }

  initBuffers() {
    const vertexArray = new VertexArray();
    const vertexBuffer = new VertexBuffer([
     -1.0, -1.0,  1.0,  1.0,  1.0,  1.0, // white
      1.0, -1.0,  0.7,  0.2,  0.0,  1.0, // red
      1.0,  1.0,  0.0,  0.7,  0.5,  1.0, // green
     -1.0,  1.0,  0.5,  0.0,  0.7,  1.0, // blue
    ]);

    vertexBuffer.setLayout(
      ShaderDataType.Vec2, // vertices
      ShaderDataType.Vec4, // color
    );

    vertexArray.addVertexBuffer(vertexBuffer);
    vertexArray.setIndexBuffer(new IndexBuffer([
      0, 1, 2,
      2, 3, 0,
    ]));

    return vertexArray;
  }
}
