import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import TreeVisualizer3D from "./TreeVisualizer3D";
import TreeVisualizer3DCSS from "./TreeVisualizer3DCSS";
import ControlsPanel from "./ControlsPanel";
import ThemeToggle from "./ThemeToggle";
import TraversalOutput from "./TraversalOutput";
import { useTheme } from "../lib/stores/useTheme";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useIsMobile } from "../hooks/use-is-mobile";

export default function BinaryTreeVisualizer() {
  const { theme } = useTheme();
  const { currentTraversal, isAnimating } = useBinaryTree();
  const isMobile = useIsMobile();
  const [canWebGL, setCanWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Robust WebGL capability check using Three.js utilities
    const checkWebGLSupport = () => {
      try {
        // Use Three.js official capability checks
        const isWebGL2Available = (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext('webgl2');
          } catch {
            return false;
          }
        })();
        
        const isWebGLAvailable = (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch {
            return false;
          }
        })();

        // Renderer probe with exact Canvas attributes
        let rendererProbeSuccess = false;
        try {
          const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            depth: true,
            stencil: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false
          });
          
          const context = renderer.getContext();
          rendererProbeSuccess = !!(context && !context.isContextLost());
          renderer.dispose();
        } catch (error) {
          console.warn('WebGL renderer probe failed:', error);
          rendererProbeSuccess = false;
        }

        const supported = rendererProbeSuccess && (isWebGL2Available || isWebGLAvailable);
        
        console.info('WebGL capability check:', {
          isWebGL2Available,
          isWebGLAvailable,
          rendererProbeSuccess,
          supported,
          canvasAttrsUsed: {
            antialias: true,
            alpha: true,
            depth: true,
            stencil: false,
            powerPreference: 'high-performance'
          }
        });
        
        return supported;
      } catch (error) {
        console.warn('WebGL capability check failed:', error);
        return false;
      }
    };

    setCanWebGL(checkWebGLSupport());
  }, []);

  return (
    <div className={`w-full h-full relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Controls Panel */}
      <div className="absolute top-4 left-4 right-16 z-40">
        <ControlsPanel />
      </div>

      {/* 3D Canvas or Fallback */}
      {canWebGL === null ? (
        // Loading state
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse mx-auto mb-2"></div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Checking WebGL support...
            </div>
          </div>
        </div>
      ) : canWebGL ? (
        // WebGL supported - render 3D Canvas
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Canvas
            shadows
            camera={{
              position: [0, 5, 15],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
              preserveDrawingBuffer: false,
              stencil: false,
              depth: true,
              failIfMajorPerformanceCaveat: false
            }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            {/* Background */}
            <color 
              attach="background" 
              args={[theme === 'dark' ? '#0f172a' : '#f8fafc']} 
            />
            
            {/* Lighting */}
            <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={theme === 'dark' ? 0.8 : 1} 
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight 
              position={[0, 10, 0]} 
              intensity={theme === 'dark' ? 0.5 : 0.3}
              color={theme === 'dark' ? '#60a5fa' : '#fbbf24'}
            />

            <TreeVisualizer3D />
          </Canvas>
        </motion.div>
      ) : (
        // WebGL not supported - use CSS3D fallback
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TreeVisualizer3DCSS />
          
          {/* CSS3D Fallback Notice */}
          <div className="absolute top-20 right-4 z-50 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs shadow-lg">
            CSS3D Mode
          </div>
        </motion.div>
      )}

      {/* Traversal Output */}
      <div className={`absolute bottom-4 left-4 right-4 z-40 ${isMobile ? 'max-h-32' : 'max-h-40'}`}>
        <TraversalOutput />
      </div>

      {/* Loading overlay for animations */}
      {isAnimating && (
        <motion.div 
          className="absolute inset-0 z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentTraversal ? `Running ${currentTraversal} traversal...` : 'Processing...'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
