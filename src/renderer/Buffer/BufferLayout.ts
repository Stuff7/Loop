import gl from '@Loop/core/gfx/WebGL2';
import assert from '@Loop/utils/assert';

export enum ShaderDataType {
  None,
  Vec, Vec2, Vec3, Vec4,
  Mat3, Mat4,
  Int, Int2, Int3, Int4,
  Bool,
}

export class BufferElement {
  type: ShaderDataType;
  size: number;
  offset: number;
  normalized: boolean;

  constructor(type: ShaderDataType, normalized = false) {
    this.type = type;
    this.size = this.typeSize;
    this.offset = 0;
    this.normalized = normalized;
  }

  get componentCount() {
    switch (this.type) {
      case ShaderDataType.Vec:
      case ShaderDataType.Int:
      case ShaderDataType.Bool:
        return 1;
      case ShaderDataType.Vec2:
      case ShaderDataType.Int2:
        return 2;
      case ShaderDataType.Vec3:
      case ShaderDataType.Mat3:
      case ShaderDataType.Int3:
        return 3;
      case ShaderDataType.Vec4:
      case ShaderDataType.Mat4:
      case ShaderDataType.Int4:
        return 4;
      default:
        assert(false, 'Unknown ShaderDataType');
    }
  }

  get typeSize() {
    switch (this.type) {
      case ShaderDataType.Vec:
      case ShaderDataType.Int:
        return 4;
      case ShaderDataType.Vec2:
      case ShaderDataType.Int2:
        return 4 * 2;
      case ShaderDataType.Vec3:
      case ShaderDataType.Int3:
        return 4 * 3;
      case ShaderDataType.Vec4:
      case ShaderDataType.Int4:
        return 4 * 4;
      case ShaderDataType.Mat3:
        return 4 * 3 * 3;
      case ShaderDataType.Mat4:
        return 4 * 4 * 4;
      case ShaderDataType.Bool:
        return 1;
      default:
        assert(false, 'Unknown ShaderDataType');
    }
  }

  get webGLType() {
    switch (this.type) {
      case ShaderDataType.Vec:
      case ShaderDataType.Vec2:
      case ShaderDataType.Vec3:
      case ShaderDataType.Vec4:
      case ShaderDataType.Mat3:
      case ShaderDataType.Mat4:
        return gl.FLOAT;
      case ShaderDataType.Int:
      case ShaderDataType.Int2:
      case ShaderDataType.Int3:
      case ShaderDataType.Int4:
        return gl.INT;
      case ShaderDataType.Bool:
        return gl.BOOL;
      default:
        assert(false, 'Unknown ShaderDataType');
    }
  }
}

export default class BufferLayout {
  private m_Elements: BufferElement[];
  private m_Stride = 0;
  forEach: typeof this.m_Elements.forEach;

  constructor(...elements: (
    BufferElement | { type: ShaderDataType, normalized?: boolean } | ShaderDataType
  )[]) {
    const layoutElements = elements.map((element) => {
      if (element instanceof BufferElement) {
        return element;
      }
      if (typeof element === 'number') {
        return new BufferElement(element);
      }
      return new BufferElement(element.type, element.normalized);
    });
    this.m_Elements = layoutElements;
    this.forEach = this.m_Elements.forEach.bind(this.m_Elements);
    this.calculateOffsetAndStride();
  }

  get elements() {
    return this.m_Elements;
  }

  get stride() {
    return this.m_Stride;
  }

  [Symbol.iterator]() {
    let index = -1;
    const elements = this.m_Elements;

    return {
      next: () => ({ value: elements[++index], done: !(index in elements) }),
    };
  }

  private calculateOffsetAndStride() {
    let offset = 0;
    this.m_Stride = 0;
    this.m_Elements.forEach(element => {
      element.offset = offset;
      offset += element.size;
      this.m_Stride += element.size;
    });
  }
}
