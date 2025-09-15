import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Environment } from "@react-three/drei";
import { useControls } from "leva";
import { DEBUG_MODE, PRODUCTION_DEFAULTS } from "../debugConfig";
import * as THREE from "three";
import Water from "./Water";
import { Model } from "./Model";

function HDREnvironment({ worldRotationY }) {
  const envControls = DEBUG_MODE
    ? useControls("HDR Environment", {
        enabled: { value: true },
        intensity: { value: 1.2, min: 0, max: 3, step: 0.1 },
        background: { value: false },
        blur: { value: 0.05, min: 0, max: 1, step: 0.01 },
        preset: {
          value: "sunset",
          options: ["sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "city", "park", "lobby"],
        },
      })
    : PRODUCTION_DEFAULTS.hdrEnvironment;

  if (!envControls.enabled) return null;

  return (
    <Environment
      background={envControls.background}
      blur={envControls.blur}
      intensity={envControls.intensity}
      rotation={[0, worldRotationY, 0]}
      preset={envControls.preset}
    />
  );
}

function EnhancedLights() {
  const lightControls = DEBUG_MODE
    ? useControls("Additional Lights", {
        enabled: { value: false },
        ambientIntensity: { value: 0.2, min: 0, max: 2, step: 0.1 },
        directionalIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
        directionalPosition: { value: [10, 10, 5], step: 1 },
      })
    : PRODUCTION_DEFAULTS.additionalLights;

  if (!lightControls.enabled) return null;

  return (
    <>
      <ambientLight intensity={lightControls.ambientIntensity} />
      <directionalLight
        intensity={lightControls.directionalIntensity}
        position={lightControls.directionalPosition}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}

function SkyComponent({ worldRotationY }) {
  const skyControls = DEBUG_MODE
    ? useControls("Sky Settings", {
        enabled: { value: true },
        sunPosition: { value: [3600, 100, -1000], step: 10 },
        turbidity: { value: 8, min: 0, max: 20, step: 0.5 },
        rayleigh: { value: 3, min: 0, max: 10, step: 0.1 },
        mieCoefficient: { value: 0.001, min: 0, max: 1, step: 0.01 },
        mieDirectionalG: { value: 0.89, min: 0, max: 1, step: 0.01 },
      })
    : PRODUCTION_DEFAULTS.skySettings;

  if (!skyControls.enabled) return null;

  const rotatedSun = React.useMemo(() => {
    const v = new THREE.Vector3(skyControls.sunPosition[0], skyControls.sunPosition[1], skyControls.sunPosition[2]);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), worldRotationY);
    return [v.x, v.y, v.z];
  }, [skyControls.sunPosition, worldRotationY]);

  return (
    <Sky
      sunPosition={rotatedSun}
      turbidity={skyControls.turbidity}
      rayleigh={skyControls.rayleigh}
      mieCoefficient={skyControls.mieCoefficient}
      mieDirectionalG={skyControls.mieDirectionalG}
    />
  );
}

export default function Experience() {
  const meshRef = useRef();
  const { camera, gl, scene, size } = useThree();
  const [reflectionTarget, setReflectionTarget] = useState(null);

  const time = useRef(0);
  const startTime = useRef(performance.now());

  const [config, setConfig] = useState({
    frequency: 2,
    amplitude: 0.07,
    pixelation: 1.0,
    reflectivity: 0.7,
    roughness: 0.4,
    roughnessScale: 1.5,
    transparency: 0.9,
    tintColor: "#15bbeb",
    blurRadius: 5,
    blurStrength: 1.0,
    maxReflectAngleDeg: 30,
  });

  // Single world rotation for sky+environment alignment
  const world = DEBUG_MODE
    ? useControls("World Orientation", {
        rotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
      })
    : { rotationY: 0 };

  // Optional water controls in debug mode
  if (DEBUG_MODE) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControls("Water", {
      frequency: {
        value: config.frequency,
        min: 0.1,
        max: 10,
        step: 0.1,
        onChange: (v) => setConfig((c) => ({ ...c, frequency: v })),
      },
      amplitude: {
        value: config.amplitude,
        min: 0,
        max: 0.5,
        step: 0.005,
        onChange: (v) => setConfig((c) => ({ ...c, amplitude: v })),
      },
      pixelation: {
        value: config.pixelation,
        min: 0.5,
        max: 4,
        step: 0.1,
        onChange: (v) => setConfig((c) => ({ ...c, pixelation: v })),
      },
      reflectivity: {
        value: config.reflectivity,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => setConfig((c) => ({ ...c, reflectivity: v })),
      },
      roughness: {
        value: config.roughness,
        min: 0,
        max: 1,
        step: 0.005,
        onChange: (v) => setConfig((c) => ({ ...c, roughness: v })),
      },
      roughnessScale: {
        value: config.roughnessScale,
        min: 0.1,
        max: 5,
        step: 0.1,
        onChange: (v) => setConfig((c) => ({ ...c, roughnessScale: v })),
      },
      transparency: {
        value: config.transparency,
        min: 0.0,
        max: 1.0,
        step: 0.01,
        onChange: (v) => setConfig((c) => ({ ...c, transparency: v })),
      },
      tintColor: {
        value: config.tintColor,
        label: "Tint",
        onChange: (v) => setConfig((c) => ({ ...c, tintColor: v })),
      },
      blurRadius: {
        value: config.blurRadius,
        min: 0.0,
        max: 4.0,
        step: 0.05,
        onChange: (v) => setConfig((c) => ({ ...c, blurRadius: v })),
      },
      blurStrength: {
        value: config.blurStrength,
        min: 0.0,
        max: 1.0,
        step: 0.01,
        onChange: (v) => setConfig((c) => ({ ...c, blurStrength: v })),
      },
      maxReflectAngleDeg: {
        value: config.maxReflectAngleDeg,
        label: "Reflect Cutoff (deg)",
        min: 0,
        max: 89,
        step: 1,
        onChange: (v) => setConfig((c) => ({ ...c, maxReflectAngleDeg: v })),
      },
    });
  }

  const reflectionCamera = useMemo(() => camera.clone(), [camera]);

  useEffect(() => {
    const target = new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBFormat,
      stencilBuffer: false,
      depthBuffer: true,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    target.texture.colorSpace = THREE.SRGBColorSpace;
    setReflectionTarget(target);

    return () => target.dispose();
  }, []);

  useEffect(() => {
    if (!reflectionTarget) return;
    reflectionTarget.setSize(size.width, size.height);
  }, [size, reflectionTarget]);

  useEffect(() => {
    const handleResize = () => {
      const now = performance.now();
      startTime.current = now - time.current * 1000;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame(() => {
    const now = performance.now();
    time.current = (now - startTime.current) / 1000;

    if (!reflectionTarget) return;

    reflectionCamera.position.copy(camera.position);
    reflectionCamera.position.y *= -1;

    const target = new THREE.Vector3(0, 0.5, 0);
    reflectionCamera.lookAt(target.x, -target.y, target.z);
    reflectionCamera.updateMatrixWorld();
    reflectionCamera.updateProjectionMatrix();

    gl.setRenderTarget(reflectionTarget);
    gl.clear();

    scene.traverse((child) => {
      if (child.name === "water") child.visible = false;
    });
    gl.render(scene, reflectionCamera);
    scene.traverse((child) => {
      if (child.name === "water") child.visible = true;
    });

    gl.setRenderTarget(null);
  });

  if (!reflectionTarget) return null;

  return (
    <>
      <SkyComponent worldRotationY={world.rotationY} />
      <HDREnvironment worldRotationY={world.rotationY} />
      <EnhancedLights />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.09}
        minDistance={3}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />

      <group ref={meshRef} position={[0, 0, 0]}>
        <Model scale={0.2} position={[0, 0.1, 0]} />
      </group>
      <Water reflectionTarget={reflectionTarget} config={config} timeRef={time} reflectionCamera={reflectionCamera} />
    </>
  );
}
