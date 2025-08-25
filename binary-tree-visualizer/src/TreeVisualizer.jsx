import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TreeVisualizer = ({ tree, traversal, onAnimate }) => {
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    if (traversal && onAnimate) {
      traversal.forEach((value, index) => {
        setTimeout(() => setHighlighted(value), index * 500);  // Animate every 0.5s
      });
      setTimeout(() => setHighlighted(null), traversal.length * 500);  // Reset
    }
  }, [traversal, onAnimate]);

  // Calculate tree depth for dynamic viewBox
  const getDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  };

  const depth = tree.root ? getDepth(tree.root) : 1;
  const viewBoxWidth = depth * 100;
  const viewBoxHeight = depth * 60 + 40;

  const renderNode = (node, x, y, level) => {
    if (!node) return null;
    const spacing = 100 / (level * 0.5);  // Adjusted spacing for better scaling
    const isHighlighted = highlighted === node.value;
    return (
      <g key={node.value}>
        <motion.circle
          cx={x} cy={y} r="20"
          fill={isHighlighted ? 'yellow' : 'lightblue'}
          stroke="black"
          animate={{ scale: isHighlighted ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <text x={x} y={y + 5} textAnchor="middle" className="text-sm">{node.value}</text>
        {node.left && (
          <>
            <line x1={x} y1={y + 20} x2={x - spacing} y2={y + 60} stroke="black" />
            {renderNode(node.left, x - spacing, y + 60, level + 1)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y + 20} x2={x + spacing} y2={y + 60} stroke="black" />
            {renderNode(node.right, x + spacing, y + 60, level + 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <svg
      width="100%"
      height="400"
      viewBox={`-${viewBoxWidth / 2} 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className="mx-auto"
    >
      {tree.root && renderNode(tree.root, 0, 20, 1)}
    </svg>
  );
};

export default TreeVisualizer;