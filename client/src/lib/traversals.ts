import { BinaryTreeNode } from "./binaryTree";

export type TraversalCallback = (node: BinaryTreeNode) => Promise<void>;

export async function inorderTraversal(
  root: BinaryTreeNode | null, 
  callback: TraversalCallback
): Promise<void> {
  if (!root) return;
  
  await inorderTraversal(root.left, callback);
  await callback(root);
  await inorderTraversal(root.right, callback);
}

export async function preorderTraversal(
  root: BinaryTreeNode | null, 
  callback: TraversalCallback
): Promise<void> {
  if (!root) return;
  
  await callback(root);
  await preorderTraversal(root.left, callback);
  await preorderTraversal(root.right, callback);
}

export async function postorderTraversal(
  root: BinaryTreeNode | null, 
  callback: TraversalCallback
): Promise<void> {
  if (!root) return;
  
  await postorderTraversal(root.left, callback);
  await postorderTraversal(root.right, callback);
  await callback(root);
}

export async function levelOrderTraversal(
  root: BinaryTreeNode | null, 
  callback: TraversalCallback
): Promise<void> {
  if (!root) return;
  
  const queue: BinaryTreeNode[] = [root];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    await callback(current);
    
    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
}

export async function morrisTraversal(
  root: BinaryTreeNode | null, 
  callback: TraversalCallback
): Promise<void> {
  if (!root) return;
  
  let current = root;
  
  while (current) {
    if (!current.left) {
      // No left child, visit current and go right
      await callback(current);
      current = current.right!;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }
      
      if (!predecessor.right) {
        // Make current the right child of its inorder predecessor
        predecessor.right = current;
        current = current.left!;
      } else {
        // Restore the tree structure
        predecessor.right = null;
        await callback(current);
        current = current.right!;
      }
    }
  }
}

export function getTraversalDescription(type: string): string {
  switch (type) {
    case 'inorder':
      return 'Visit left subtree, then root, then right subtree (L→R→R)';
    case 'preorder':
      return 'Visit root, then left subtree, then right subtree (R→L→R)';
    case 'postorder':
      return 'Visit left subtree, then right subtree, then root (L→R→R)';
    case 'levelorder':
      return 'Visit nodes level by level from top to bottom (BFS)';
    case 'morris':
      return 'Inorder traversal without recursion or stack (O(1) space)';
    default:
      return 'Binary tree traversal algorithm';
  }
}

export function getTraversalComplexity(type: string): { time: string; space: string } {
  switch (type) {
    case 'inorder':
    case 'preorder':
    case 'postorder':
      return { time: 'O(n)', space: 'O(h)' }; // h = height of tree
    case 'levelorder':
      return { time: 'O(n)', space: 'O(w)' }; // w = maximum width of tree
    case 'morris':
      return { time: 'O(n)', space: 'O(1)' };
    default:
      return { time: 'O(n)', space: 'O(n)' };
  }
}
