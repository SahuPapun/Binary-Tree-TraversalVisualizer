import { useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useTheme } from "../lib/stores/useTheme";

interface CSS3DNodeProps {
  node: { id: string; value: number };
  position: [number, number, number];
  isHighlighted: boolean;
  theme: 'light' | 'dark';
}

function CSS3DNode({ node, position, isHighlighted, theme }: CSS3DNodeProps) {
  const nodeElement = useMemo(() => {
    const div = document.createElement('div');
    div.style.width = '60px';
    div.style.height = '60px';
    div.style.borderRadius = '50%';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '18px';
    div.style.border = '2px solid';
    div.style.transition = 'all 0.3s ease';
    div.style.userSelect = 'none';
    div.style.cursor = 'grab';
    div.textContent = node.value.toString();
    
    // Apply theme-based styling
    if (isHighlighted) {
      div.style.backgroundColor = theme === 'dark' ? '#fbbf24' : '#f59e0b';
      div.style.borderColor = theme === 'dark' ? '#fbbf24' : '#f59e0b';
      div.style.color = '#000';
      div.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.8)';
      div.style.transform = 'scale(1.1)';
    } else {
      div.style.backgroundColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
      div.style.borderColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
      div.style.color = '#fff';
      div.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
    }
    
    return div;
  }, [node.value, isHighlighted, theme]);

  useEffect(() => {
    // Update styling when props change
    if (isHighlighted) {
      nodeElement.style.backgroundColor = theme === 'dark' ? '#fbbf24' : '#f59e0b';
      nodeElement.style.borderColor = theme === 'dark' ? '#fbbf24' : '#f59e0b';
      nodeElement.style.color = '#000';
      nodeElement.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.8)';
      nodeElement.style.transform = 'scale(1.1)';
    } else {
      nodeElement.style.backgroundColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
      nodeElement.style.borderColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
      nodeElement.style.color = '#fff';
      nodeElement.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
      nodeElement.style.transform = 'scale(1)';
    }
  }, [isHighlighted, theme, nodeElement]);

  return { element: nodeElement, position };
}

export default function TreeVisualizer3DCSS() {
  const { tree, highlightedNode } = useBinaryTree();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<CSS3DRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<any>();

  // Initialize CSS3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new CSS3DRenderer();
    
    // Ensure renderer fills container properly
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.background = theme === 'dark' ? '#0f172a' : '#f8fafc';
    
    container.appendChild(renderer.domElement);
    
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0); // Set proper camera target
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Resize handler with proper viewport management
    const resize = () => {
      const width = container.clientWidth || 800; // Fallback width
      const height = container.clientHeight || 600; // Fallback height
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      console.info('CSS3D renderer resized:', { width, height });
    };

    // Initial resize
    resize();

    // Setup ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Window resize fallback
    const handleWindowResize = () => resize();
    window.addEventListener('resize', handleWindowResize);

    // Add basic controls (simplified)
    const handleMouseMove = (event: MouseEvent) => {
      if (event.buttons === 1) { // Left mouse button
        const deltaX = event.movementX * 0.01;
        const deltaY = event.movementY * 0.01;
        
        // Simple orbit controls
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX;
        spherical.phi += deltaY;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      camera.position.clampLength(5, 50);
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    let animationId: number;
    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
    };
  }, [theme]);

  // Update tree visualization
  useEffect(() => {
    if (!sceneRef.current || !tree) return;

    // Clear existing objects
    const objectsToRemove: THREE.Object3D[] = [];
    sceneRef.current.traverse((child) => {
      if (child instanceof CSS3DObject) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

    // Render nodes recursively
    const renderNode = (node: any, x: number, y: number, z: number, level: number) => {
      if (!node || !sceneRef.current) return;

      const spacing = Math.max(8 / (level + 1), 2);
      const leftX = x - spacing;
      const rightX = x + spacing;
      const childY = y - 3;

      // Create CSS3D node
      const cssNode = CSS3DNode({
        node,
        position: [x, y, z],
        isHighlighted: highlightedNode === node.id,
        theme
      });

      const css3dObject = new CSS3DObject(cssNode.element);
      css3dObject.position.set(x * 50, y * 50, z * 50); // Scale for CSS3D
      sceneRef.current.add(css3dObject);

      // Render edges as CSS lines
      if (node.left) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.height = '2px';
        line.style.backgroundColor = theme === 'dark' ? '#60a5fa' : '#4f46e5';
        line.style.transformOrigin = '0 0';
        line.style.opacity = '0.8';
        
        const startX = x * 50;
        const startY = y * 50;
        const endX = leftX * 50;
        const endY = childY * 50;
        
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const angle = Math.atan2(endY - startY, endX - startX);
        
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}rad)`;
        
        const lineObject = new CSS3DObject(line);
        lineObject.position.set(startX, startY, z * 50);
        sceneRef.current.add(lineObject);
        
        renderNode(node.left, leftX, childY, z, level + 1);
      }

      if (node.right) {
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.height = '2px';
        line.style.backgroundColor = theme === 'dark' ? '#60a5fa' : '#4f46e5';
        line.style.transformOrigin = '0 0';
        line.style.opacity = '0.8';
        
        const startX = x * 50;
        const startY = y * 50;
        const endX = rightX * 50;
        const endY = childY * 50;
        
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const angle = Math.atan2(endY - startY, endX - startX);
        
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}rad)`;
        
        const lineObject = new CSS3DObject(line);
        lineObject.position.set(startX, startY, z * 50);
        sceneRef.current.add(lineObject);
        
        renderNode(node.right, rightX, childY, z, level + 1);
      }
    };

    renderNode(tree, 0, 0, 0, 0);
    
    // Debug logging for verification
    const nodeCount = sceneRef.current.children.filter(child => child instanceof CSS3DObject && child.element.textContent).length;
    const edgeCount = sceneRef.current.children.filter(child => child instanceof CSS3DObject && !child.element.textContent).length;
    console.info('CSS3D tree rendered:', { nodes: nodeCount, edges: edgeCount, totalObjects: sceneRef.current.children.length });
  }, [tree, highlightedNode, theme]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0"
      style={{ 
        background: theme === 'dark' ? '#0f172a' : '#f8fafc',
        minHeight: '480px'
      }}
    />
  );
}