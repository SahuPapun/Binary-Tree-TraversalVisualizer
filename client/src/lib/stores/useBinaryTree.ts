import { create } from "zustand";
import { BinaryTreeNode, createBinaryTree, generateRandomTree } from "../binaryTree";
import { 
  inorderTraversal, 
  preorderTraversal, 
  postorderTraversal, 
  levelOrderTraversal,
  morrisTraversal 
} from "../traversals";

interface BinaryTreeState {
  tree: BinaryTreeNode | null;
  highlightedNode: string | null;
  traversalResult: number[];
  currentTraversal: string | null;
  isAnimating: boolean;
  
  // Actions
  addNode: (value: number) => void;
  removeNode: (value: number) => void;
  resetTree: () => void;
  generateRandomTree: () => void;
  runTraversal: (type: 'inorder' | 'preorder' | 'postorder' | 'levelorder' | 'morris') => void;
  updateNodePosition: (nodeId: string, position: [number, number, number]) => void;
  setHighlightedNode: (nodeId: string | null) => void;
}

export const useBinaryTree = create<BinaryTreeState>((set, get) => ({
  tree: null,
  highlightedNode: null,
  traversalResult: [],
  currentTraversal: null,
  isAnimating: false,

  addNode: (value) =>
    set((state) => ({
      tree: createBinaryTree(state.tree, value),
    })),

  removeNode: (value) =>
    set((state) => {
      // Implementation for node removal would go here
      // For now, we'll keep it simple and not implement removal
      return state;
    }),

  resetTree: () =>
    set(() => ({
      tree: null,
      highlightedNode: null,
      traversalResult: [],
      currentTraversal: null,
      isAnimating: false,
    })),

  generateRandomTree: () =>
    set(() => ({
      tree: generateRandomTree(),
      highlightedNode: null,
      traversalResult: [],
      currentTraversal: null,
      isAnimating: false,
    })),

  runTraversal: async (type) => {
    const state = get();
    if (!state.tree || state.isAnimating) return;

    set({ 
      isAnimating: true, 
      currentTraversal: type, 
      traversalResult: [],
      highlightedNode: null 
    });

    let traversalFunction;
    switch (type) {
      case 'inorder':
        traversalFunction = inorderTraversal;
        break;
      case 'preorder':
        traversalFunction = preorderTraversal;
        break;
      case 'postorder':
        traversalFunction = postorderTraversal;
        break;
      case 'levelorder':
        traversalFunction = levelOrderTraversal;
        break;
      case 'morris':
        traversalFunction = morrisTraversal;
        break;
      default:
        traversalFunction = inorderTraversal;
    }

    const result: number[] = [];
    
    // Animate traversal
    await traversalFunction(state.tree, async (node: BinaryTreeNode) => {
      // Highlight current node
      set({ highlightedNode: node.id });
      result.push(node.value);
      
      // Wait for animation duration
      await new Promise(resolve => setTimeout(resolve, 700));
    });

    // Complete animation
    set({ 
      highlightedNode: null, 
      traversalResult: result, 
      isAnimating: false 
    });
  },

  updateNodePosition: (nodeId, position) =>
    set((state) => {
      // For now, we'll keep positions in the tree structure simple
      // In a full implementation, you'd update node positions here
      return state;
    }),

  setHighlightedNode: (nodeId) =>
    set({ highlightedNode: nodeId }),
}));
