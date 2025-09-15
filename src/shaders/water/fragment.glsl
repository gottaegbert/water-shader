uniform sampler2D uReflectionMap;
uniform float uPixelation;
uniform float uReflectivity;
uniform float uRoughness;
uniform float uRoughnessScale;
uniform vec3 uBaseColor;
uniform float uTransparency;
uniform float uBlurRadius;    // in texels multiplier
uniform float uBlurStrength;  // 0..1
uniform float uMaxReflectAngleDeg; // reflections visible only when view angle <= this

varying vec4 vWPosition;
varying vec3 vNormal;
varying vec2 vRefUv;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vWPosition.xyz - cameraPosition);

  // Sample the reflection render using coordinates from reflection camera
  vec2 uv = clamp(vRefUv + normal.xz * 0.06, 0.0, 1.0);
  vec3 reflection = texture(uReflectionMap, uv).rgb;
  // Hide reflections when view angle is steeper than threshold
  float cosTheta = clamp(dot(normal, -viewDir), 0.0, 1.0);
  float cosThreshold = cos(radians(uMaxReflectAngleDeg));
  float reflectMask = step(cosThreshold, cosTheta);
  reflection *= reflectMask;
  // Roughness-aware blur 
  vec2 texel = 18.0 / vec2(textureSize(uReflectionMap, 0)); //reflection blur
  float rad = max(0.0, uBlurRadius) * max(0.0, uRoughness * uRoughnessScale);
  vec2 r = texel * rad;
  vec3 sum = reflection * 4.0;
  sum += texture(uReflectionMap, clamp(uv + vec2( r.x, 0.0), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2(-r.x, 0.0), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2(0.0,  r.y), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2(0.0, -r.y), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2( r.x,  r.y), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2(-r.x,  r.y), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2( r.x, -r.y), 0.0, 1.0)).rgb;
  sum += texture(uReflectionMap, clamp(uv + vec2(-r.x, -r.y), 0.0, 1.0)).rgb;
  vec3 blurred = sum / 12.0;
  reflection = mix(reflection, blurred, clamp(uBlurStrength, 0.0, 1.0));
  float d = max(0.1, dot(normal, -normalize(vec3(3, 10, 7))));

  vec3 color = reflection;
  color *= pow(d, 0.4);
  color += pow(smoothstep(0.9, 0.95, d), 3.) * 0.9;
  // Subtle blue tint
  color = mix(color, uBaseColor, 0.25);

  // Horizontal distance-based edge fade (fade only near the 20x20 plane border)
  // Half-size ~10, so start fading around 9.0 → 10.0
  float edge = 1.0 - smoothstep(9.0, 10.0, length(vWPosition.xz));
  gl_FragColor = vec4(color, uTransparency * edge);
}
