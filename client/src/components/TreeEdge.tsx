import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface TreeEdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  theme: 'light' | 'dark';
}

export default function TreeEdge({ start, end, theme }: TreeEdgeProps) {
  const lineRef = useRef<any>();

  // Create curved line points
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);
    
    // Add slight curve for visual appeal
    midPoint.y += Math.abs(startVec.x - endVec.x) * 0.1;
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return curve.getPoints(20);
  }, [start, end]);

  // Animate the line
  useFrame((state) => {
    if (lineRef.current) {
      // Subtle pulsing animation
      const opacity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      lineRef.current.material.opacity = opacity;
    }
  });

  const lineColor = theme === 'dark' ? '#60a5fa' : '#4f46e5';

  return (
    <Line
      ref={lineRef}
      points={points}
      color={lineColor}
      lineWidth={3}
      transparent
      opacity={0.8}
    />
  );
}
