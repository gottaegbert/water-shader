export const DEBUG_MODE = true;

export const PRODUCTION_DEFAULTS = {
  hdrEnvironment: {
    enabled: true,
    intensity: 1.2,
    background: true,
    blur: 0.05,
    preset: "sunset",
  },
  additionalLights: {
    enabled: false,
    ambientIntensity: 0.2,
    directionalIntensity: 0.5,
    directionalPosition: [10, 10, 5],
  },
  skySettings: {
    enabled: true,
    sunPosition: [3600, 40, -1000],
    turbidity: 0.5,
    rayleigh: 1.1,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.94,
  },
  ship: {
    mainPaintColor: "#526476",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    floatAmplitude: 0.1,
    floatSpeed: 0.8,
  },
};
