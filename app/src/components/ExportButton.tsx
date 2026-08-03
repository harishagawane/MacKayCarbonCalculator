import { motion } from 'framer-motion';
import { Download, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  filename?: string;
}

export const ExportButton = ({ targetRef, filename = 'my2050-scenario.png' }: ExportButtonProps) => {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = useCallback(async () => {
    if (!targetRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [targetRef, filename, exporting]);

  return (
    <motion.button
      onClick={handleExport}
      disabled={exporting}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        done
          ? 'bg-green-600 text-white'
          : 'bg-[#1A5276] hover:bg-[#154360] text-white'
      } disabled:opacity-60`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <motion.div
        initial={false}
        animate={done ? { rotate: [0, 360] } : {}}
        transition={{ duration: 0.5 }}
      >
        {done ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
      </motion.div>
      {exporting ? 'Exporting...' : done ? 'Exported!' : 'Export Image'}
    </motion.button>
  );
};
