import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    let stored: string|null = null;
    try {stored=window.localStorage.getItem('my2050-theme');}catch{/* optional */}
    return stored ? stored === 'dark' : document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {window.localStorage.setItem('my2050-theme', isDark ? 'dark' : 'light');}catch{/* optional */}
  }, [isDark]);

  useEffect(() => {
    let stored: string|null = null;
    try {stored=window.localStorage.getItem('my2050-theme');}catch{/* optional */}
    if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  return (
    <motion.button
      onClick={() => setIsDark(p => !p)}
      className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur-md transition-colors hover:shadow-xl dark:border-slate-600 dark:bg-slate-800/95"
      whileHover={{ scale: 1.08, rotate: 8 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </motion.div>
    </motion.button>
  );
};
