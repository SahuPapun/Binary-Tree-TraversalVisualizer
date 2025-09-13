import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useTheme } from "../lib/stores/useTheme";
import { useIsMobile } from "../hooks/use-is-mobile";

export default function TraversalOutput() {
  const { traversalResult, currentTraversal, isAnimating } = useBinaryTree();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [displayedNodes, setDisplayedNodes] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect for displaying traversal results
  useEffect(() => {
    if (traversalResult && traversalResult.length > 0 && !isAnimating) {
      setDisplayedNodes([]);
      setCurrentIndex(0);
      
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < traversalResult.length) {
            setDisplayedNodes((nodes) => [...nodes, traversalResult[prev]]);
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [traversalResult, isAnimating]);

  // Clear display when starting new animation
  useEffect(() => {
    if (isAnimating) {
      setDisplayedNodes([]);
      setCurrentIndex(0);
    }
  }, [isAnimating]);

  const glassClass = theme === 'dark' ? 'glass-dark' : 'glass';

  if (!currentTraversal && displayedNodes.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`${glassClass} rounded-lg p-4 shadow-xl`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {currentTraversal ? `${currentTraversal.charAt(0).toUpperCase()}${currentTraversal.slice(1)} Traversal` : 'Traversal Result'}
            </h3>
            {isAnimating && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            )}
          </div>

          {/* Traversal Result */}
          <div className={`${isMobile ? 'max-h-16' : 'max-h-24'} overflow-auto scrollbar-thin`}>
            {displayedNodes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayedNodes.map((node, index) => (
                  <motion.div
                    key={`${node}-${index}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg font-medium shadow-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    }}
                  >
                    {node}
                  </motion.div>
                ))}
                
                {/* Cursor effect during typewriter animation */}
                {currentIndex < (traversalResult?.length || 0) && (
                  <motion.div
                    className="w-0.5 h-6 bg-blue-500"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </div>
            ) : (
              <div className="text-slate-600 dark:text-slate-400 text-sm italic">
                {isAnimating ? 'Running traversal...' : 'Select a traversal type and click Run to see the result.'}
              </div>
            )}
          </div>

          {/* Stats */}
          {displayedNodes.length > 0 && !isAnimating && (
            <motion.div 
              className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-300 dark:border-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {displayedNodes.length} node{displayedNodes.length !== 1 ? 's' : ''} visited
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
