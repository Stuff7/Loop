import gl from '@Loop/core/gfx/WebGL2';
import assert from '@Loop/utils/assert';
import BufferLayout, { ShaderDataType } from './BufferLayout';

export * from './BufferLayout';

export class VertexBuffer {
  private m_Buffer: WebGLBuffer;
  private m_Layout: BufferLayout = new BufferLayout();

  constructor(vertices?: Iterable<number>) {
		const buffer = gl.createBuffer();
    assert(buffer, `Failed to create buffer from ${vertices}`);
    this.m_Buffer = buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);

    if (!vertices) {
      gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
      return;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  }

  get layout() {
    return this.m_Layout;
  }

  setLayout(...types: ShaderDataType[]) {
    this.m_Layout = new BufferLayout(...types);
  }

  bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_Buffer);
  }

  unbind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, 0);
  }

  setData(data: BufferSource) {
    this.bind();
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  }
}

export class IndexBuffer {
  private m_Buffer: WebGLBuffer;

  constructor(indices?: Iterable<number>) {
		const buffer = gl.createBuffer();
    assert(buffer, `Failed to create buffer from ${indices}`);
    this.m_Buffer = buffer;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_Buffer);

    if (!indices) {
      gl.bufferData(gl.ARRAY_BUFFER, null, gl.DYNAMIC_DRAW);
      return;
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  }

  bind() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_Buffer);
  }

  unbind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, 0);
  }
}
