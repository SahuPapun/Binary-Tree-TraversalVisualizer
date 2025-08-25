class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value, parentValue = null, direction = 'left') {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    const parent = this.findNode(parentValue);
    if (parent) {
      if (direction === 'left') parent.left = newNode;
      else parent.right = newNode;
    }
  }

  findNode(value) {
    if (!this.root) return null;
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      if (node.value === value) return node;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return null;
  }

  generateRandom(size = 10) {
    this.root = new Node(Math.floor(Math.random() * 100));
    for (let i = 1; i < size; i++) {
      const value = Math.floor(Math.random() * 100);
      let current = this.root;
      while (true) {
        const dir = Math.random() > 0.5 ? 'left' : 'right';
        if (dir === 'left' && !current.left) {
          current.left = new Node(value);
          break;
        } else if (dir === 'right' && !current.right) {
          current.right = new Node(value);
          break;
        }
        current = dir === 'left' ? current.left : current.right;
      }
    }
  }

  // Traversals (return array for display and animation steps)
  preorder() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  inorder() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  postorder() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };
    traverse(this.root);
    return result;
  }

  levelOrder() {
    const result = [];
    if (!this.root) return result;
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  spiralOrder() {  // Zigzag level order
    const result = [];
    if (!this.root) return result;
    const stack1 = [this.root];  // Left to right
    const stack2 = [];  // Right to left
    while (stack1.length || stack2.length) {
      while (stack1.length) {
        const node = stack1.pop();
        result.push(node.value);
        if (node.left) stack2.push(node.left);
        if (node.right) stack2.push(node.right);
      }
      while (stack2.length) {
        const node = stack2.pop();
        result.push(node.value);
        if (node.right) stack1.push(node.right);
        if (node.left) stack1.push(node.left);
      }
    }
    return result;
  }
}

export default BinaryTree;