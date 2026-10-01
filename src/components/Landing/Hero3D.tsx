import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa371f7, 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const group = new THREE.Group();
    scene.add(group);

    const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ color: '#58a6ff', wireframe: true, transparent: true, opacity: 0.3 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-4, 2, -2);
    group.add(sphere);

    const sphere2Geo = new THREE.SphereGeometry(1, 32, 32);
    const sphere2Mat = new THREE.MeshStandardMaterial({ color: '#a371f7', transparent: true, opacity: 0.4 });
    const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
    sphere2.position.set(4, -2, -1);
    group.add(sphere2);

    const torusKnotGeo = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
    const torusKnotMat = new THREE.MeshStandardMaterial({ color: '#f778ba', wireframe: true, transparent: true, opacity: 0.4 });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    torusKnot.position.set(0, 0, -3);
    group.add(torusKnot);

    const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: '#3fb950', transparent: true, opacity: 0.3, wireframe: true });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(-3, -3, -2);
    box.rotation.set(0.5, 0.5, 0);
    group.add(box);

    const box2Geo = new THREE.BoxGeometry(1, 1, 1);
    const box2Mat = new THREE.MeshStandardMaterial({ color: '#d29922', transparent: true, opacity: 0.5 });
    const box2 = new THREE.Mesh(box2Geo, box2Mat);
    box2.position.set(3, 3, -1);
    box2.rotation.set(0.3, 0.7, 0.2);
    group.add(box2);

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const target = targetRef.current;
      group.position.x += (target.x * 1.5 - group.position.x) * 0.05;
      group.position.y += (target.y * 1.5 - group.position.y) * 0.05;

      group.rotation.y += 0.002;
      group.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      sphere2Geo.dispose();
      sphere2Mat.dispose();
      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      box2Geo.dispose();
      box2Mat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
