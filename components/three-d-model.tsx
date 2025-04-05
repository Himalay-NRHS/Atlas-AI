"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, useProgress, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-primary font-medium">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

function HeartModel() {
  // Update the file path according to your actual file name and folder structure
  const gltf = useGLTF('/realistic_human_heart/scene.gltf', true)
  const heartGroup = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (heartGroup.current) {
      heartGroup.current.rotation.y += delta * 0.2
      // Optional gentle pulsing effect:
      const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1
      heartGroup.current.scale.set(pulseFactor, pulseFactor, pulseFactor)
    }
  })

  return (
    <group ref={heartGroup}>
      <primitive object={gltf.scene} />
      <Html position={[0, 0, 1.5]} distanceFactor={10}>
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <div className="text-sm font-medium text-primary">Interactive 3D Model</div>
          <div className="text-xs text-gray-500">Drag to rotate</div>
        </div>
      </Html>
    </group>
  )
}

export default function ThreeDModel() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <HeartModel />
          <OrbitControls enableZoom={true} />
          {/* Wrap the Environment in its own Suspense to isolate its state updates */}
          <Suspense fallback={null}>
            <Environment preset="studio" />
          </Suspense>
        </Suspense>
      </Canvas>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
        <p className="text-sm text-gray-600">
          Explore complex structures in 3D to enhance understanding and retention.
        </p>
      </motion.div>
    </div>
  )
}
