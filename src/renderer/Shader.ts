import gl from '@Loop/core/gfx/WebGL2';
import assert from '@Loop/utils/assert';
import { mat4 } from 'gl-matrix';

interface IShader {
  bind(): void;
  uploadUniformMat4(name: string, matrix: mat4, transpose?: boolean): void;
}

const ShaderType = {
  [gl.FRAGMENT_SHADER]: 'fragment',
  [gl.VERTEX_SHADER]: 'vertex',
} as const;

export default class Shader implements IShader {
  private m_Program: WebGLProgram;
  private m_AttributeLocationCache: Record<string, number> = {};
  private m_UniformLocationCache: Record<string, WebGLUniformLocation> = {};

  constructor(vsSource: string, fsSource: string) {
    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const program = gl.createProgram();

    // Only continue if WebGL is available and working
    assert(program, 'Failed to create shader program');

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // If creating the shader program failed, throw
    const isLinked: boolean = gl.getProgramParameter(
      program,
      gl.LINK_STATUS,
    );

    if (!isLinked) {
      const errorInfo = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Failed to initialize shader program: ${errorInfo}`);
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    this.m_Program = program;
  }

  get program() {
    return this.m_Program;
  }

  bind() {
    gl.useProgram(this.program);
  }

  unbind() {
    gl.useProgram(0);
  }

  uploadUniformMat4(name: string, matrix: mat4, transpose = false) {
    const location = this.getUniformLocation(name);
    return gl.uniformMatrix4fv(
      location,
      transpose,
      matrix,
    );
  }

  private getUniformLocation(name: string) {
    if (name in this.m_UniformLocationCache) {
      return this.m_UniformLocationCache[name];
    }
    const location = gl.getUniformLocation(this.program, name);
    assert(location, `Could not find uniform location with name "${name}"`);
    this.m_UniformLocationCache[name] = location;

    return location;
  }

  private loadShader(type: number, source: string) {
    const shaderType = ShaderType[type];
    const shader = gl.createShader(type);

    assert(shader, `Failed to create ${shaderType} shader`);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    const isCompiled: boolean = gl.getShaderParameter(
      shader,
      gl.COMPILE_STATUS,
    );

    if (!isCompiled) {
      const errorInfo = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Failed to compile ${shaderType} shader: ${errorInfo}`);
    }

    return shader;
  }
}
