#version 300 es

layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out lowp vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexPosition * 0.5 + 0.5 * aVertexColor;
}
