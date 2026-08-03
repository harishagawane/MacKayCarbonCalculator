import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/45 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
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
              className="bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl dark:border dark:border-gray-700"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ 
                type: 'spring', 
                stiffness: 380, 
                damping: 26,
                mass: 0.75
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800/80 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#1A5276] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">UK</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Department for Business, Energy & Industrial Strategy
                  </span>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <motion.h2 
                  className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  My 2050 - CREATE YOUR PATHWAY TO A LOW CARBON UK BY 2050
                </motion.h2>
                
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 mb-3 text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Find your pathway to reduce UK greenhouse gas emissions to Net Zero 
                  by 2050 (-100% in the CO₂e meter) by:
                </motion.p>
                
                <motion.ul 
                  className="list-disc list-inside space-y-1.5 text-gray-700 dark:text-gray-300 mb-4 ml-1 text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <li>
                    choosing your level of ambition from 1 (minimum effort) to 4 (extreme effort) 
                    for each of the levers of decarbonisation at the bottom
                  </li>
                  <li>
                    limiting the number of extreme Level 4s you need to a few you think are most important
                  </li>
                </motion.ul>
                
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  Find more information{' '}
                  <a 
                    href="https://www.gov.uk/guidance/carbon-calculator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1A5276] dark:text-[#5DADE2] hover:underline font-medium"
                  >
                    here
                  </a>.
                </motion.p>
              </div>
              
              {/* Footer */}
              <div className="p-3 border-t bg-gray-50 dark:bg-gray-800/80 dark:border-gray-700 flex justify-end">
                <a
                  href="https://www.gov.uk/guidance/carbon-calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A5276] dark:text-[#5DADE2] hover:underline text-xs font-medium"
                >
                  Conditions of Use
                </a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
