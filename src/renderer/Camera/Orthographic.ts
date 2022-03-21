import {
  mat4,
  vec3,
} from 'gl-matrix';

export default class OrthographicCamera {
  private m_ProjectionMatrix = mat4.create();
  private m_ViewMatrix = mat4.create();
  private m_ViewProjectionMatrix = mat4.create();

  private m_Position = vec3.create();
  private m_Rotation = 0;

  constructor(left: number, right: number, bottom: number, top: number) {
    this.setProjection(left, right, bottom, top);
  }

  get projectionMatrix() {
    return this.m_ProjectionMatrix;
  }

  get viewMatrix() {
    return this.m_ViewMatrix;
  }

  get viewProjectionMatrix() {
    return this.m_ViewProjectionMatrix;
  }

  get position() {
    return this.m_Position;
  }

  set position(position: vec3) {
    this.m_Position = position;
    this.recalculateViewMatrix();
  }

  get rotation() {
    return this.m_Rotation;
  }

  set rotation(rotation: number) {
    this.m_Rotation = rotation;
    this.recalculateViewMatrix();
  }

  setPosition(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
  }

  setProjection(left: number, right: number, bottom: number, top: number) {
    mat4.ortho(this.m_ProjectionMatrix, left, right, bottom, top, -1.0, 1.0);
    mat4.multiply(this.m_ViewProjectionMatrix, this.m_ProjectionMatrix, this.m_ViewMatrix);
  }

  private recalculateViewMatrix() {
    const translation = mat4.create();
    mat4.translate(translation, mat4.create(), this.m_Position);

    const rotation = mat4.create();
    mat4.rotate(
      rotation,
      mat4.create(),
      this.m_Rotation,
      vec3.fromValues(0, 0, 1),
    );

    const transform = mat4.create();
    mat4.multiply(transform, translation, rotation);

    mat4.invert(this.m_ViewMatrix, transform);
    mat4.multiply(this.m_ViewProjectionMatrix, this.m_ProjectionMatrix, this.m_ViewMatrix);
  }
}
