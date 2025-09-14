uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
uniform mat4 uRefProjectionMatrix;
uniform mat4 uRefViewMatrix;

varying vec4 vWPosition;
varying vec3 vNormal;
varying vec2 vRefUv;

float getElevation(vec3 pos) {
  float e = cnoise(pos.xyz * uFrequency + uTime * 0.85) * uAmplitude;
  e += cnoise(pos.xyz * uFrequency * 4. + uTime * 2.) * uAmplitude * 0.2;
  return e;
}

void main() {
  vec3 pos = position;
  vec4 wPosition = modelMatrix * vec4(pos,1.0);
  float e = 0.1;
  vec3 wPositionX = wPosition.xyz + vec3(e,0.,0.);
  vec3 wPositionZ = wPosition.xyz + vec3(0.,0.,e);

  wPosition.y += getElevation(wPosition.xyz);
  wPositionX.y += getElevation(wPositionX.xyz);
  wPositionZ.y += getElevation(wPositionZ.xyz);
  vNormal = normalize(cross(wPositionX.xyz - wPosition.xyz, wPositionZ.xyz - wPosition.xyz));

  vWPosition = wPosition;

  // Project world position into reflection camera clip space -> uv
  vec4 refClip = uRefProjectionMatrix * uRefViewMatrix * wPosition;
  vec2 ndc = refClip.xy / refClip.w;
  vRefUv = ndc * 0.5 + 0.5;

  gl_Position = projectionMatrix * viewMatrix * wPosition;
}
