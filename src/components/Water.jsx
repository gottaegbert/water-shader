import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import noise from "../shaders/noise.glsl?raw";
import functions from "../shaders/functions.glsl?raw";
import vertexMain from "../shaders/water/vertex.glsl?raw";
import fragmentMain from "../shaders/water/fragment.glsl?raw";

export default function Water({ reflectionTarget, config, timeRef, reflectionCamera }) {
  const materialRef = useRef();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uFrequency.value = config.frequency;
      materialRef.current.uniforms.uAmplitude.value = config.amplitude;
      materialRef.current.uniforms.uPixelation.value = config.pixelation;
      materialRef.current.uniforms.uReflectivity.value = config.reflectivity;
      materialRef.current.uniforms.uRoughness.value = config.roughness;
      materialRef.current.uniforms.uRoughnessScale.value = config.roughnessScale;
      if (materialRef.current.uniforms.uTransparency)
        materialRef.current.uniforms.uTransparency.value = config.transparency ?? 0.6;
      if (materialRef.current.uniforms.uBaseColor)
        materialRef.current.uniforms.uBaseColor.value.set(config.tintColor ?? "#1a5fa2");
      if (materialRef.current.uniforms.uBlurRadius)
        materialRef.current.uniforms.uBlurRadius.value = config.blurRadius ?? 1.5;
      if (materialRef.current.uniforms.uBlurStrength)
        materialRef.current.uniforms.uBlurStrength.value = config.blurStrength ?? 0.7;
      if (reflectionCamera) {
        materialRef.current.uniforms.uRefProjectionMatrix.value.copy(reflectionCamera.projectionMatrix);
        materialRef.current.uniforms.uRefViewMatrix.value.copy(reflectionCamera.matrixWorldInverse);
      }
    }
  });

  return (
    <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.01, 0]} name="water" receiveShadow>
      <planeGeometry args={[20, 20, 200, 200]} />
      {/* Force material remount on shader edits (hot-reload) */}
      <shaderMaterial
        key={useMemo(() => `${vertexMain}\n---\n${fragmentMain}`, [vertexMain, fragmentMain])}
        ref={materialRef}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexShader={`${noise}\n${functions}\n${vertexMain}`}
        fragmentShader={`${noise}\n${functions}\n${fragmentMain}`}
        uniforms={{
          uTime: { value: 0 },
          uFrequency: { value: config.frequency },
          uAmplitude: { value: config.amplitude },
          uPixelation: { value: config.pixelation },
          uReflectivity: { value: config.reflectivity },
          uRoughness: { value: config.roughness },
          uRoughnessScale: { value: config.roughnessScale },
          uReflectionMap: { value: reflectionTarget.texture },
          uBaseColor: { value: new THREE.Color(config.tintColor ?? "#1a5fa2") },
          uTransparency: { value: config.transparency ?? 0.9 },
          uBlurRadius: { value: config.blurRadius ?? 1.5 },
          uBlurStrength: { value: config.blurStrength ?? 0.7 },
          uRefProjectionMatrix: { value: new THREE.Matrix4() },
          uRefViewMatrix: { value: new THREE.Matrix4() },
        }}
      />
    </mesh>
  );
}
