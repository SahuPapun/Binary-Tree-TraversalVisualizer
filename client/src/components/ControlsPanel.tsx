import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shuffle, RotateCcw, Play, ChevronDown } from "lucide-react";
import { useBinaryTree } from "../lib/stores/useBinaryTree";
import { useTheme } from "../lib/stores/useTheme";
import { useIsMobile } from "../hooks/use-is-mobile";

const traversalTypes = [
  { key: 'inorder', label: 'Inorder', description: 'Left → Root → Right' },
  { key: 'preorder', label: 'Preorder', description: 'Root → Left → Right' },
  { key: 'postorder', label: 'Postorder', description: 'Left → Right → Root' },
  { key: 'levelorder', label: 'Level Order', description: 'Breadth-First Search' },
  { key: 'morris', label: 'Morris', description: 'Threaded Traversal' },
];

export default function ControlsPanel() {
  const { 
    addNode, 
    generateRandomTree, 
    resetTree, 
    runTraversal, 
    isAnimating,
    tree 
  } = useBinaryTree();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const [nodeValue, setNodeValue] = useState('');
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [showTraversals, setShowTraversals] = useState(false);

  const handleAddNode = () => {
    if (nodeValue.trim() && !isAnimating) {
      const value = parseInt(nodeValue.trim());
      if (!isNaN(value)) {
        addNode(value);
        setNodeValue('');
      }
    }
  };

  const handleRunTraversal = () => {
    if (!isAnimating && tree) {
      runTraversal(selectedTraversal as any);
    }
  };

  const glassClass = theme === 'dark' ? 'glass-dark' : 'glass';

  return (
    <motion.div
      className={`${glassClass} rounded-lg p-4 shadow-xl`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-wrap items-center gap-4'}`}>
        {/* Add Node Section */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={nodeValue}
            onChange={(e) => setNodeValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNode()}
            placeholder="Node value"
            disabled={isAnimating}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 
                     text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed w-24"
          />
          <motion.button
            onClick={handleAddNode}
            disabled={isAnimating || !nodeValue.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed
                     text-white rounded-lg font-medium flex items-center space-x-1 shadow-md
                     transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </motion.button>
        </div>

        {/* Tree Operations */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={generateRandomTree}
            disabled={isAnimating}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed
                     text-white rounded-lg font-medium flex items-center space-x-1 shadow-md
                     transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shuffle className="w-4 h-4" />
            <span>{isMobile ? 'Random' : 'Generate Random'}</span>
          </motion.button>
          
          <motion.button
            onClick={resetTree}
            disabled={isAnimating}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed
                     text-white rounded-lg font-medium flex items-center space-x-1 shadow-md
                     transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
        </div>

        {/* Traversal Section */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <motion.button
              onClick={() => setShowTraversals(!showTraversals)}
              disabled={isAnimating}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed
                       text-white rounded-lg font-medium flex items-center space-x-1 shadow-md
                       transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{traversalTypes.find(t => t.key === selectedTraversal)?.label}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${showTraversals ? 'rotate-180' : ''}`} />
            </motion.button>
            
            {showTraversals && (
              <motion.div
                className={`absolute top-full left-0 mt-1 ${glassClass} rounded-lg shadow-xl z-50 min-w-48`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {traversalTypes.map((traversal) => (
                  <button
                    key={traversal.key}
                    onClick={() => {
                      setSelectedTraversal(traversal.key);
                      setShowTraversals(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-white/20 dark:hover:bg-black/20 
                               transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                               ${selectedTraversal === traversal.key ? 'bg-white/30 dark:bg-black/30' : ''}`}
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {traversal.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {traversal.description}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <motion.button
            onClick={handleRunTraversal}
            disabled={isAnimating || !tree}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed
                     text-white rounded-lg font-medium flex items-center space-x-1 shadow-md
                     transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
