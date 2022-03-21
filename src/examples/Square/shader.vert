#version 300 es

layout(location = 0) in vec4 aPosition;
layout(location = 1) in vec4 aColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewProjectionMatrix;

out lowp vec4 vColor;

void main(void) {
  gl_Position = uViewProjectionMatrix * aPosition;
  vColor = aPosition * 0.5 + 0.5 * aColor;
}
