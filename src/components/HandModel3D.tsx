import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HandTrackingResult } from '../types/hand';

interface HandModel3DProps {
  handResults: HandTrackingResult[];
}

export const HandModel3D: React.FC<HandModel3DProps> = ({ handResults }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const handsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2.5);

    // Inside src/components/HandModel3D.tsx
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      });
    } catch (e) {
      console.warn("WebGL hardware context unavailable, switching renderer config.", e);
      renderer = new THREE.WebGLRenderer({ antialias: false, precision: "lowp" });
    }

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    // Root Group for 3D Hands
    const handsGroup = new THREE.Group();
    scene.add(handsGroup);
    handsGroupRef.current = handsGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D Joint Meshes when new hand tracking data comes in
  useEffect(() => {
    const handsGroup = handsGroupRef.current;
    if (!handsGroup) return;

    // Clear previous frame's joint visuals
    while (handsGroup.children.length > 0) {
      const obj = handsGroup.children[0];
      handsGroup.remove(obj);
    }

    handResults.forEach((res) => {
      const handSubGroup = new THREE.Group();
      const isRight = res.handedness === 'Right';
      const sphereColor = isRight ? 0x38bdf8 : 0xa855f7; // Cyan for Right, Purple for Left

      res.landmarks.forEach((lm) => {
        const sphereGeo = new THREE.SphereGeometry(0.02, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({ color: sphereColor });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);

        // Map normalized coordinates [0, 1] to 3D world space with X-axis mirror inversion
        const x = -(lm.normalized.x - 0.5) * 3;
        const y = -(lm.normalized.y - 0.5) * 3;
        const z = -lm.normalized.z * 3;

        sphere.position.set(x, y, z);
        handSubGroup.add(sphere);
      });

      handsGroup.add(handSubGroup);
    });
  }, [handResults]);

  return (
    <div className="panel col-span-5" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <span>WebGL 3D Dual-Hand Model View</span>
        </div>
      </div>
      <div ref={mountRef} style={{ width: '100%', flex: 1, minHeight: '380px', borderRadius: '8px', overflow: 'hidden' }} />
    </div>
  );
};