import * as THREE from "three";

export let waveParams = {
  wave1: { direction: 45, steepness: 0.008, wavelength: 30 },
  wave2: { direction: 306, steepness: 0.006, wavelength: 20 },
  wave3: { direction: 196, steepness: 0.007, wavelength: 35 },
};

export const waves = [waveParams.wave1, waveParams.wave2, waveParams.wave3];

export let globalWaterTime = 0;
export let waveSteepnessMultiplier = 1;
export let waveTimeSpeedMultiplier = 0.5;

export function updateGlobalWaterTime(delta) {
  globalWaterTime += delta * waveTimeSpeedMultiplier;
}

export function updateWaveSteepnessMultiplier(multiplier) {
  waveSteepnessMultiplier = Math.max(0.1, Math.min(10, multiplier));
}

export function updateWaveTimeSpeedMultiplier(multiplier) {
  waveTimeSpeedMultiplier = Math.max(0.1, Math.min(5.0, multiplier));
}

export function updateWaveParam(waveKey, param, value) {
  if (waveParams[waveKey] && waveParams[waveKey][param] !== undefined) {
    waveParams[waveKey][param] = value;
    const waveIndex = Object.keys(waveParams).indexOf(waveKey);
    if (waveIndex >= 0) {
      waves[waveIndex] = waveParams[waveKey];
    }
  }
}

export function updateWaveParams(newParams) {
  waveParams = { ...waveParams, ...newParams };
  waves[0] = waveParams.wave1;
  waves[1] = waveParams.wave2;
  waves[2] = waveParams.wave3;
}

export function getScaledWaves() {
  return Object.values(waveParams).map((wave) => ({
    ...wave,
    steepness: wave.steepness * waveSteepnessMultiplier,
  }));
}

export function getWaveInfo(x, z, time) {
  const pos = new THREE.Vector3();
  const tangent = new THREE.Vector3(1, 0, 0);
  const binormal = new THREE.Vector3(0, 0, 1);

  const scaledWaves = getScaledWaves();

  Object.keys(scaledWaves).forEach((wave) => {
    const w = scaledWaves[wave];
    const k = (Math.PI * 2) / w.wavelength;
    const c = Math.sqrt(9.8 / k);
    const d = new THREE.Vector2(Math.sin((w.direction * Math.PI) / 180), -Math.cos((w.direction * Math.PI) / 180));
    const f = k * (d.dot(new THREE.Vector2(x, z)) - c * time);
    const a = w.steepness / k;

    pos.x += d.y * (a * Math.cos(f));
    pos.y += a * Math.sin(f);
    pos.z += d.x * (a * Math.cos(f));

    tangent.x += -d.x * d.x * (w.steepness * Math.sin(f));
    tangent.y += d.x * (w.steepness * Math.cos(f));
    tangent.z += -d.x * d.y * (w.steepness * Math.sin(f));

    binormal.x += -d.x * d.y * (w.steepness * Math.sin(f));
    binormal.y += d.y * (w.steepness * Math.cos(f));
    binormal.z += -d.y * d.y * (w.steepness * Math.sin(f));
  });

  const normal = binormal.cross(tangent).normalize();
  return { position: pos, normal };
}

