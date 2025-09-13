import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useTheme } from "../lib/stores/useTheme";

interface BinaryTreeNodeProps {
  node: { id: string; value: number };
  position: [number, number, number];
  isHighlighted: boolean;
}

export default function BinaryTreeNode({ node, position, isHighlighted }: BinaryTreeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { updateNodePosition } = useBinaryTree();
  const { theme } = useTheme();
  const { viewport, camera, gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Animation for highlighting
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation for highlighted nodes
      if (isHighlighted) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.1;
        meshRef.current.scale.setScalar(scale);
      } else if (hovered) {
        // Hover effect
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        // Normal state
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Drag functionality
  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = hovered ? 'grab' : 'auto';
  };

  const handlePointerMove = (event: any) => {
    if (isDragging && meshRef.current) {
      event.stopPropagation();
      
      // Convert screen coordinates to world coordinates
      const vec = new THREE.Vector3();
      vec.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.z / vec.z;
      vec.multiplyScalar(distance).add(camera.position);
      
      // Update node position
      updateNodePosition(node.id, [vec.x, vec.y, position[2]]);
    }
  };

  // Colors based on theme and state
  const getNodeColor = () => {
    if (isHighlighted) {
      return theme === 'dark' ? '#fbbf24' : '#f59e0b'; // Golden yellow
    }
    if (hovered) {
      return theme === 'dark' ? '#60a5fa' : '#3b82f6'; // Blue
    }
    return theme === 'dark' ? '#6366f1' : '#4f46e5'; // Indigo
  };

  const getGlowColor = () => {
    if (isHighlighted) return '#fbbf24';
    if (hovered) return theme === 'dark' ? '#60a5fa' : '#3b82f6';
    return theme === 'dark' ? '#6366f1' : '#4f46e5';
  };

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh
        scale={isHighlighted ? [2.2, 2.2, 2.2] : hovered ? [2.1, 2.1, 2.1] : [2, 2, 2]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={getGlowColor()}
          transparent
          opacity={isHighlighted ? 0.3 : hovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          gl.domElement.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          setHovered(false);
          if (!isDragging) {
            gl.domElement.style.cursor = 'auto';
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={getNodeColor()}
          metalness={0.3}
          roughness={0.2}
          emissive={getNodeColor()}
          emissiveIntensity={isHighlighted ? 0.3 : hovered ? 0.1 : 0.05}
        />
      </mesh>

      {/* Node value text */}
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.8}
        color={theme === 'dark' ? '#ffffff' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {node.value.toString()}
      </Text>

      {/* Shadow/depth indicator */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
