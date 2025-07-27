// src/Themetoggle.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../themeslice';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme); 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  return (
    <button
      onClick={handleToggle}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
      data-tip={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;