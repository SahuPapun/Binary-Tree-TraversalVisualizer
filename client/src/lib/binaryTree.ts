import { nanoid } from 'nanoid';

export interface BinaryTreeNode {
  id: string;
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  position?: [number, number, number];
}

export function createNode(value: number): BinaryTreeNode {
  return {
    id: nanoid(),
    value,
    left: null,
    right: null,
  };
}

export function createBinaryTree(root: BinaryTreeNode | null, value: number): BinaryTreeNode {
  if (!root) {
    return createNode(value);
  }

  if (value < root.value) {
    root.left = createBinaryTree(root.left, value);
  } else if (value > root.value) {
    root.right = createBinaryTree(root.right, value);
  }
  // If value equals root.value, we don't add it (no duplicates)

  return root;
}

export function findNode(root: BinaryTreeNode | null, value: number): BinaryTreeNode | null {
  if (!root) return null;
  if (root.value === value) return root;
  if (value < root.value) return findNode(root.left, value);
  return findNode(root.right, value);
}

export function getTreeHeight(root: BinaryTreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

export function getTreeNodeCount(root: BinaryTreeNode | null): number {
  if (!root) return 0;
  return 1 + getTreeNodeCount(root.left) + getTreeNodeCount(root.right);
}

export function generateRandomTree(nodeCount: number = 10): BinaryTreeNode | null {
  const values = new Set<number>();
  
  // Generate unique random values
  while (values.size < nodeCount) {
    values.add(Math.floor(Math.random() * 100) + 1);
  }

  let root: BinaryTreeNode | null = null;
  
  // Create tree from random values
  Array.from(values).forEach(value => {
    root = createBinaryTree(root, value);
  });

  return root;
}

export function validateBST(root: BinaryTreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;
  
  if (root.value <= min || root.value >= max) return false;
  
  return validateBST(root.left, min, root.value) && 
         validateBST(root.right, root.value, max);
}

export function serializeTree(root: BinaryTreeNode | null): string {
  if (!root) return 'null';
  
  return `${root.value},${serializeTree(root.left)},${serializeTree(root.right)}`;
}

export function deserializeTree(data: string): BinaryTreeNode | null {
  const values = data.split(',');
  let index = 0;
  
  function buildTree(): BinaryTreeNode | null {
    if (index >= values.length || values[index] === 'null') {
      index++;
      return null;
    }
    
    const value = parseInt(values[index++]);
    const node = createNode(value);
    node.left = buildTree();
    node.right = buildTree();
    
    return node;
  }
  
  return buildTree();
}
