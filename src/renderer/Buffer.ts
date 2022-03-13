import gl from '@Loop/core/gfx/WebGL2';
import { assertNull } from '@Loop/utils/assert';

export class VertexBuffer {
  buffer: WebGLBuffer;

  constructor(vertices?: Iterable<number>) {
		const buffer = gl.createBuffer();
    assertNull(buffer, `Failed to create buffer from ${vertices}`);
    this.buffer = buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    if (!vertices) {
      gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
      return;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  }

  bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  }

  setData(data: BufferSource) {
    this.bind();
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  }
}

export class IndexBuffer {
  buffer: WebGLBuffer;

  constructor(indices?: Iterable<number>) {
		const buffer = gl.createBuffer();
    assertNull(buffer, `Failed to create buffer from ${indices}`);
    this.buffer = buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    if (!indices) {
      gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
      return;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  }

  bind() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }
}
