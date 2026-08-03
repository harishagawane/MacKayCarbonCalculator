import { useState, useEffect, useCallback } from 'react';
import { decodeLevelsFromUrl, encodeLevelsToUrl } from '@/data/calculations';
import { levers } from '@/data/levers';
import { PRESET_SCENARIOS, type PresetScenario } from '@/data/presets';

const DEFAULT_LEVELS = new Array(levers.length).fill(1);
const STORAGE_KEY = 'my2050-levels';
const COMPARISON_KEY = 'my2050-comparison';

const loadFromStorage = (key: string): number[] | null => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === levers.length) {
        return parsed.map((l: number) => Math.min(Math.max(l, 1), 4));
      }
    }
  } catch { /* ignore */ }
  return null;
};

const saveToStorage = (key: string, levels: number[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(levels));
  } catch { /* ignore */ }
};

export const useLeverState = () => {
  const [levels, setLevels] = useState<number[]>(DEFAULT_LEVELS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [comparisonLevels, setComparisonLevels] = useState<number[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('levers');
    if (encoded) {
      setLevels(decodeLevelsFromUrl(encoded));
    } else {
      const stored = loadFromStorage(STORAGE_KEY);
      if (stored) setLevels(stored);
    }
    // Load comparison
    const savedComparison = loadFromStorage(COMPARISON_KEY);
    if (savedComparison) setComparisonLevels(savedComparison);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const encoded = encodeLevelsToUrl(levels);
      window.history.replaceState({}, '', `${window.location.pathname}?levers=${encoded}`);
      saveToStorage(STORAGE_KEY, levels);
    }
  }, [levels, isInitialized]);

  const setLevel = useCallback((index: number, level: number) => {
    setLevels(prev => {
      const nl = [...prev];
      nl[index] = Math.min(Math.max(level, 1), 4);
      return nl;
    });
    setActivePreset(null);
  }, []);

  const reset = useCallback(() => {
    setLevels(DEFAULT_LEVELS);
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset: PresetScenario) => {
    setLevels([...preset.levels]);
    setActivePreset(preset.id);
  }, []);

  const saveForComparison = useCallback(() => {
    saveToStorage(COMPARISON_KEY, levels);
    setComparisonLevels([...levels]);
  }, [levels]);

  const clearComparison = useCallback(() => {
    localStorage.removeItem(COMPARISON_KEY);
    setComparisonLevels(null);
  }, []);

  const getShareUrl = useCallback(() => {
    return `${window.location.origin}${window.location.pathname}?levers=${encodeLevelsToUrl(levels)}`;
  }, [levels]);

  return {
    levels,
    setLevel,
    reset,
    applyPreset,
    activePreset,
    getShareUrl,
    isInitialized,
    PRESET_SCENARIOS,
    comparisonLevels,
    saveForComparison,
    clearComparison,
  };
};
