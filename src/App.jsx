import React from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import { Leva } from 'leva'


export default function App() {
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 60, position: [5, 2.5, 5] }}
        gl={{ antialias: Math.min(window.devicePixelRatio, 2) < 2 }}
      >
        <Experience />
      </Canvas>
      <Leva collapsed={false} oneLineLabels hideCopyButton />
    </>
  )
}
