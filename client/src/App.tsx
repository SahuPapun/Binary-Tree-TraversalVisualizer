import { Suspense } from "react";
import BinaryTreeVisualizer from "./components/BinaryTreeVisualizer";
import "@fontsource/inter";

function App() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-xl font-medium text-slate-600 dark:text-slate-400">
            Loading 3D Binary Tree Visualizer...
          </div>
        </div>
      }>
        <BinaryTreeVisualizer />
      </Suspense>
    </div>
  );
}

export default App;
