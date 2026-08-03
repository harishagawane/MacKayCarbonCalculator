import { motion, AnimatePresence } from 'framer-motion';
import type { Lever } from '@/types';
import { leverIcons } from './LeverIcons';
import { X } from 'lucide-react';

interface LeverModalProps {
  lever: Lever | null;
  currentLevel: number;
  isOpen: boolean;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

const levelColors: Record<number, string> = {
  1: '#E74C3C',
  2: '#E67E22',
  3: '#F1C40F',
  4: '#27AE60',
};

const levelLabels: Record<number, string> = {
  1: 'Minimum',
  2: 'Moderate',
  3: 'High',
  4: 'Extreme',
};

export const LeverModal = ({ 
  lever, 
  currentLevel, 
  isOpen, 
  onClose, 
  onLevelChange 
}: LeverModalProps) => {
  if (!lever) return null;

  const Icon = leverIcons[lever.id];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl dark:border dark:border-gray-700"
              initial={{ scale: 0.88, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 35 }}
              transition={{ 
                type: 'spring', 
                stiffness: 380, 
                damping: 26,
                mass: 0.75
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div 
                className="flex items-start gap-3 p-5 border-b bg-gradient-to-r from-[#EBF5FB] to-white dark:from-slate-800 dark:to-gray-800 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
              >
                <motion.div 
                  className="w-12 h-12 flex-shrink-0"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.12, type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {Icon && <Icon className="w-full h-full" color="var(--lever-accent)" />}
                </motion.div>
                <div className="flex-1">
                  <motion.h2 
                    className="text-lg font-bold text-gray-900 dark:text-gray-100"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 }}
                  >
                    {lever.name}
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {lever.description}
                  </motion.p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </motion.div>
              
              {/* Content */}
              <div className="p-5">
                {/* Level selector */}
                <motion.div 
                  className="mb-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Ambition Level:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((level, idx) => (
                      <motion.button
                        key={level}
                        onClick={() => onLevelChange(level)}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 font-semibold transition-all text-sm ${
                          currentLevel === level
                            ? 'border-[#1A5276] bg-[#EBF5FB] text-[#1A5276] dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-300'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600 dark:border-gray-700 dark:hover:border-gray-500 dark:text-gray-400'
                        }`}
                        initial={{ opacity: 0, y: 15, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.22 + idx * 0.04, type: 'spring', stiffness: 400, damping: 22 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <motion.div 
                          className="text-xl mb-0.5"
                          animate={currentLevel === level ? { scale: [1, 1.08, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {level}
                        </motion.div>
                        <div className="text-[10px]">{levelLabels[level]}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                
                {/* Level descriptions */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Level Descriptions:
                  </label>
                  {lever.levels.map((level, idx) => (
                    <motion.div
                      key={level.level}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        currentLevel === level.level
                          ? 'border-[#1A5276] bg-[#EBF5FB] dark:border-sky-400 dark:bg-sky-900/40'
                          : 'border-gray-200 dark:border-gray-700 opacity-45'
                      }`}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ 
                        opacity: currentLevel === level.level ? 1 : 0.45,
                        x: 0 
                      }}
                      transition={{ delay: 0.32 + idx * 0.04 }}
                      whileHover={currentLevel !== level.level ? { opacity: 0.65 } : {}}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <motion.div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: levelColors[level.level] }}
                          animate={currentLevel === level.level ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {level.level}
                        </motion.div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          Ambition Level {level.level}
                        </span>
                        {currentLevel === level.level && (
                          <motion.span 
                            className="ml-auto text-[10px] bg-[#1A5276] text-white px-1.5 py-0.5 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            Selected
                          </motion.span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                        {level.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Impact */}
                <motion.div 
                  className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Emissions Reduction Impact:</span>
                    <motion.span 
                      className="text-lg font-bold"
                      style={{ color: levelColors[currentLevel] }}
                      key={currentLevel}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      +{lever.levels.find(l => l.level === currentLevel)?.emissionsImpact || 0}%
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
