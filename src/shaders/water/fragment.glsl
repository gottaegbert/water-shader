uniform sampler2D uReflectionMap;
uniform float uPixelation;
uniform float uReflectivity;
uniform float uRoughness;
uniform float uRoughnessScale;

varying vec4 vWPosition;
varying vec3 vNormal;
varying vec2 vRefUv;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vWPosition.xyz - cameraPosition);

  // Sample the reflection render using coordinates from reflection camera
  vec2 uv = clamp(vRefUv + normal.xz * 0.06, 0.0, 1.0);
  vec3 reflection = texture(uReflectionMap, uv).rgb;
  float d = max(0.0, dot(normal, -normalize(vec3(3, 10, 7))));

  vec3 color = reflection;
  color *= pow(d, 0.4);
  color += pow(smoothstep(0.9, 0.95, d), 3.) * 0.9;

  float a = 1.0 - smoothstep(3.0, 7.5, length(vWPosition.xyz));

  gl_FragColor = vec4(color, a);
}
