import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Water from './Water'

export default function Experience() {
  const meshRef = useRef()
  const { camera, gl, scene, size } = useThree()
  const [reflectionTarget, setReflectionTarget] = useState(null)

  const time = useRef(0)
  const startTime = useRef(performance.now())

  const [config] = useState({
    frequency: 2,
    amplitude: 0.07,
    pixelation: 1.0,
    reflectivity: 0.7,
    roughness: 0.04,
    roughnessScale: 1.5,
  })

  const reflectionCamera = useMemo(() => camera.clone(), [camera])

  useEffect(() => {
    const target = new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBFormat,
      stencilBuffer: false,
      depthBuffer: true,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })

    target.texture.colorSpace = THREE.SRGBColorSpace
    setReflectionTarget(target)

    return () => target.dispose()
  }, [])

  useEffect(() => {
    if (!reflectionTarget) return
    reflectionTarget.setSize(size.width, size.height)
  }, [size, reflectionTarget])

  useEffect(() => {
    const handleResize = () => {
      const now = performance.now()
      startTime.current = now - time.current * 1000
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useFrame(() => {
    const now = performance.now()
    time.current = (now - startTime.current) / 1000

    if (!reflectionTarget) return

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.5 * (1 / 60)
      meshRef.current.rotation.x += 0.5 * (1 / 60)
    }

    reflectionCamera.position.copy(camera.position)
    reflectionCamera.position.y *= -1

    const target = new THREE.Vector3(0, 0.5, 0)
    reflectionCamera.lookAt(target.x, -target.y, target.z)

    gl.setRenderTarget(reflectionTarget)
    gl.clear()

    scene.traverse((child) => {
      if (child.name === 'water') child.visible = false
    })
    gl.render(scene, reflectionCamera)
    scene.traverse((child) => {
      if (child.name === 'water') child.visible = true
    })

    gl.setRenderTarget(null)
  })

  if (!reflectionTarget) return null

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 10, 7]} intensity={4.5} castShadow />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      <mesh ref={meshRef} position={[0, 1.5, 0]} castShadow>
        <torusKnotGeometry args={[0.7, 0.3, 200, 100]} />
        <meshStandardMaterial color="tomato" />
      </mesh>

      <Water
        reflectionTarget={reflectionTarget}
        config={config}
        timeRef={time}
      />
    </>
  )
}
