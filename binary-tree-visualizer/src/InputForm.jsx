import { useState, useEffect } from 'react';

const InputForm = ({ onInsert, tree }) => {
  const [value, setValue] = useState('');
  const [position, setPosition] = useState('root');

  // Generate dropdown options based on available positions
  const getAvailablePositions = () => {
    const options = [];
    if (!tree.root) {
      return [{ value: 'root', label: 'Root' }];
    }
    const queue = [tree.root];
    while (queue.length) {
      const node = queue.shift();
      if (!node.left) options.push({ value: `left-${node.value}`, label: `Left of ${node.value}` });
      if (!node.right) options.push({ value: `right-${node.value}`, label: `Right of ${node.value}` });
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return options;
  };

  const positions = getAvailablePositions();

  useEffect(() => {
    // Reset position to 'root' if tree is empty, or first available position
    if (!tree.root) setPosition('root');
    else if (positions.length > 0 && !positions.some(p => p.value === position)) {
      setPosition(positions[0].value);
    }
  }, [tree, position, positions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    if (position === 'root') {
      onInsert(Number(value), null, 'left');
    } else {
      const [direction, parentValue] = position.split('-');
      onInsert(Number(value), Number(parentValue), direction);
    }
    setValue('');
    setPosition(tree.root ? positions[0]?.value || '' : 'root');
  };

  return (
    <div className="input-form flex flex-wrap justify-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Node Value"
        required
        className="border rounded px-2 py-1"
      />
      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {positions.length === 0 && tree.root ? (
          <option value="" disabled>No available positions</option>
        ) : (
          positions.map((pos) => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))
        )}
      </select>
      <button type="submit" onClick={handleSubmit} className="btn">Insert Node</button>
    </div>
  );
};

export default InputForm;