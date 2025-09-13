import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useTheme } from "../lib/stores/useTheme";
import BinaryTreeNode from "./BinaryTreeNode";
import TreeEdge from "./TreeEdge";

export default function TreeVisualizer3D() {
  const { tree, highlightedNode } = useBinaryTree();
  const { theme } = useTheme();
  const controlsRef = useRef<any>();
  const groupRef = useRef<THREE.Group>(null);

  // Auto-fit tree in view when nodes are added
  useEffect(() => {
    if (tree && controlsRef.current && groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      if (size > 0) {
        const distance = size * 1.5;
        controlsRef.current.target.copy(center);
        controlsRef.current.object.position.set(
          center.x,
          center.y + distance * 0.3,
          center.z + distance
        );
        controlsRef.current.update();
      }
    }
  }, [tree]);

  const renderNode = (node: any, x: number, y: number, z: number, level: number) => {
    if (!node) return null;

    const spacing = Math.max(8 / (level + 1), 2);
    const leftX = x - spacing;
    const rightX = x + spacing;
    const childY = y - 3;

    return (
      <group key={`node-${node.id}-${x}-${y}`}>
        {/* Current node */}
        <BinaryTreeNode
          node={node}
          position={[x, y, z]}
          isHighlighted={highlightedNode === node.id}
        />
        
        {/* Left child and edge */}
        {node.left && (
          <>
            <TreeEdge
              start={[x, y, z]}
              end={[leftX, childY, z]}
              theme={theme}
            />
            {renderNode(node.left, leftX, childY, z, level + 1)}
          </>
        )}
        
        {/* Right child and edge */}
        {node.right && (
          <>
            <TreeEdge
              start={[x, y, z]}
              end={[rightX, childY, z]}
              theme={theme}
            />
            {renderNode(node.right, rightX, childY, z, level + 1)}
          </>
        )}
      </group>
    );
  };

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI}
      />
      
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -10, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1e293b' : '#e2e8f0'} 
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Tree group */}
      <group ref={groupRef}>
        {tree && renderNode(tree, 0, 0, 0, 0)}
      </group>

      {/* Ambient particles for atmosphere */}
      {theme === 'dark' && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={100}
              array={new Float32Array(
                Array.from({ length: 300 }, () => (Math.random() - 0.5) * 50)
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#60a5fa"
            transparent
            opacity={0.6}
            sizeAttenuation={false}
          />
        </points>
      )}
    </>
  );
}
