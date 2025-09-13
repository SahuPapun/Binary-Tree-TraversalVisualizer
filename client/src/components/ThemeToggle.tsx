import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/stores/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
          : 'bg-white text-slate-800 hover:bg-slate-50'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: theme === 'dark' ? 0 : 180 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: 1,
          rotate: theme === 'dark' ? 0 : 180 
        }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-6 h-6" />
        ) : (
          <Sun className="w-6 h-6" />
        )}
      </motion.div>
    </motion.button>
  );
}
