import { useState } from 'react';
import BinaryTree from './BinaryTree';
import TreeVisualizer from './TreeVisualizer';
import InputForm from './InputForm';
import TraversalOutput from './TraversalOutput';
import './index.css';

function App() {
  const [tree] = useState(new BinaryTree());
  const [traversalType, setTraversalType] = useState(null);
  const [traversalResult, setTraversalResult] = useState([]);
  const [animate, setAnimate] = useState(false);

  const handleInsert = (value, parent, direction) => {
    if (tree.findNode(value)) {
      alert('Value already exists in the tree!');
      return;
    }
    tree.insert(value, parent, direction);
    setTraversalResult([]); // Reset traversal output
  };

  const generateRandom = () => {
    tree.generateRandom();
    setTraversalResult([]);
  };

  const performTraversal = (type) => {
    setTraversalType(type);
    let result;
    switch (type) {
      case 'preorder': result = tree.preorder(); break;
      case 'inorder': result = tree.inorder(); break;
      case 'postorder': result = tree.postorder(); break;
      case 'level': result = tree.levelOrder(); break;
      case 'spiral': result = tree.spiralOrder(); break;
      default: return;
    }
    setTraversalResult(result);
    setAnimate(true);
    setTimeout(() => setAnimate(false), result.length * 500 + 1000); // Stop animating
  };

  return (
    <div className="app-container">
      <h1 className="title">Binary Tree Visualizer</h1>
      <InputForm onInsert={handleInsert} tree={tree} />
      <div className="controls">
        <button onClick={generateRandom} className="button">Generate Random Tree</button>
        <button onClick={() => { tree.root = null; setTraversalResult([]); }} disabled={!tree.root} className="button">Clear Tree</button>
        <button onClick={() => performTraversal('preorder')} disabled={!tree.root} className="button">Preorder</button>
        <button onClick={() => performTraversal('inorder')} disabled={!tree.root} className="button">Inorder</button>
        <button onClick={() => performTraversal('postorder')} disabled={!tree.root} className="button">Postorder</button>
        <button onClick={() => performTraversal('level')} disabled={!tree.root} className="button">Level Order</button>
        <button onClick={() => performTraversal('spiral')} disabled={!tree.root} className="button">Spiral Order</button>
      </div>
      <div className="tree-container">
        <TreeVisualizer tree={tree} traversal={traversalResult} onAnimate={animate} />
      </div>
      <TraversalOutput traversalType={traversalType} traversalResult={traversalResult} />
    </div>
  );
}

export default App;