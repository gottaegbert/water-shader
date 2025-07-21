import React from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'


export default function App() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, position: [5, 2.5, 5] }}
      gl={{ antialias: Math.min(window.devicePixelRatio, 2) < 2 }}
    >
      <color attach="background" args={['#bbccff']} />
      <Experience />
    </Canvas>
  )
}
