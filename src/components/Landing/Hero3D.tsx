import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, TorusKnot, Box } from '@react-three/drei';

function Scene({ target }: { target: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x += (target.x * 1.5 - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (target.y * 1.5 - groupRef.current.position.y) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a371f7" />

      <group ref={groupRef}>
        <Sphere args={[1.5, 32, 32]} position={[-4, 2, -2]}>
          <meshStandardMaterial color="#58a6ff" wireframe transparent opacity={0.3} />
        </Sphere>
        <Sphere args={[1, 32, 32]} position={[4, -2, -1]}>
          <meshStandardMaterial color="#a371f7" transparent opacity={0.4} />
        </Sphere>
        <TorusKnot args={[0.8, 0.3, 100, 16]} position={[0, 0, -3]}>
          <meshStandardMaterial color="#f778ba" wireframe transparent opacity={0.4} />
        </TorusKnot>
        <Box args={[1.5, 1.5, 1.5]} position={[-3, -3, -2]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial color="#3fb950" transparent opacity={0.3} wireframe />
        </Box>
        <Box args={[1, 1, 1]} position={[3, 3, -1]} rotation={[0.3, 0.7, 0.2]}>
          <meshStandardMaterial color="#d29922" transparent opacity={0.5} />
        </Box>
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export function Hero3D() {
  const [target, setTarget] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTarget({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene target={target} />
        </Suspense>
      </Canvas>
    </div>
  );
}
