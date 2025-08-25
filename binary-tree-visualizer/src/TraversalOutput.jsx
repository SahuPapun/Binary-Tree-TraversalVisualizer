import { motion } from 'framer-motion';

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
          <h3 className="output-title">
            {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal
          </h3>
          <p className="output-text">{traversalResult.join(' -> ')}</p>
        </>
      )}
    </motion.div>
  );
};

export default TraversalOutput;