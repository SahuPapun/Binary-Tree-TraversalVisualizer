import { motion } from 'framer-motion';
import './index.css';

const TraversalOutput = ({ traversalType, traversalResult }) => {
  return (
    <motion.div
      className="traversal-output"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {traversalResult.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">
            {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal
          </h3>
          <p className="text-blue-600 font-bold">{traversalResult.join(' -> ')}</p>
        </>
      )}
    </motion.div>
  );
};

export default TraversalOutput;