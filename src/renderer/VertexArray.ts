import gl from '@Loop/core/gfx/WebGL2';
import assert from '@Loop/utils/assert';
import { IndexBuffer, ShaderDataType, VertexBuffer } from './Buffer';

export default class VertexArray {
  private m_VAO: WebGLVertexArrayObject;
  private m_VertexBuffers: VertexBuffer[] = [];
  private m_IndexBuffer: IndexBuffer = new IndexBuffer([]);
  private m_VertexBufferIndex = 0;

  constructor() {
    const vao = gl.createVertexArray();
    assert(vao, 'Failed to create vertex array object');
    this.m_VAO = vao;
  }

  get indexBuffer() {
		return this.m_IndexBuffer;
  }

  set indexBuffer(indexBuffer: IndexBuffer) {
    this.setIndexBuffer(indexBuffer);
  }

  draw() {
    this.bind();
    this.m_IndexBuffer.bind();
    gl.drawElements(
      gl.TRIANGLES,
      this.m_IndexBuffer.length,
      gl.UNSIGNED_INT,
      0,
    );
  }

  setIndexBuffer(indexBuffer: IndexBuffer) {
		gl.bindVertexArray(this.m_VAO);
		indexBuffer.bind();

		this.m_IndexBuffer = indexBuffer;
  }

  bind() {
    gl.bindVertexArray(this.m_VAO);
  }

  unbind() {
    gl.bindVertexArray(0);
  }

  addVertexBuffer(vertexBuffer: VertexBuffer) {
    const { layout } = vertexBuffer;
    gl.bindVertexArray(this.m_VAO);
    vertexBuffer.bind();

    layout.forEach(element => {
      switch (element.type) {
        case ShaderDataType.Vec:
        case ShaderDataType.Vec2:
        case ShaderDataType.Vec3:
        case ShaderDataType.Vec4: {
          gl.enableVertexAttribArray(this.m_VertexBufferIndex);
          gl.vertexAttribPointer(
            this.m_VertexBufferIndex,
            element.componentCount,
            element.webGLType,
            element.normalized,
            layout.stride,
            element.offset,
          );
          this.m_VertexBufferIndex++;
          break;
        }
        case ShaderDataType.Int:
        case ShaderDataType.Int2:
        case ShaderDataType.Int3:
        case ShaderDataType.Int4:
        case ShaderDataType.Bool: {
          gl.enableVertexAttribArray(this.m_VertexBufferIndex);
          gl.vertexAttribIPointer(
            this.m_VertexBufferIndex,
            element.componentCount,
            element.webGLType,
            layout.stride,
            element.offset,
          );
          this.m_VertexBufferIndex++;
          break;
        }
        case ShaderDataType.Mat3:
        case ShaderDataType.Mat4: {
          const count = element.componentCount;
          for (let i = 0; i < count; i++) {
            gl.enableVertexAttribArray(this.m_VertexBufferIndex);
            gl.vertexAttribPointer(
              this.m_VertexBufferIndex,
              count,
              element.webGLType,
              element.normalized,
              layout.stride,
              element.offset + element.size * count * i,
            );
            gl.vertexAttribDivisor(this.m_VertexBufferIndex, 1);
            this.m_VertexBufferIndex++;
          }
          break;
        }
        default:
          assert(false, 'Unknown ShaderDataType');
      }
      this.m_VertexBuffers.push(vertexBuffer);
    });
  }
}
