import { useState, useEffect, useCallback } from 'react';
import { decodeLevelsFromUrl, encodeLevelsToUrl, validEncodedLevels, validLevels, safeLevels } from '@/data/calculations';
import { levers } from '@/data/levers';
import { PRESET_SCENARIOS, type PresetScenario } from '@/data/presets';

const DEFAULT_LEVELS = levers.map(() => 1);
const STORAGE_KEY = 'my2050-levels', COMPARISON_KEY = 'my2050-comparison';
const load = (key: string): number[] | null => {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return validLevels(parsed) ? [...parsed] : null;
  } catch { return null; }
};
const save = (key: string, levels: number[]) => {
  try { window.localStorage.setItem(key, JSON.stringify(levels)); } catch { /* optional */ }
};
const fromLocation = () => {
  const q = new URLSearchParams(window.location.search).get('levers');
  return q && validEncodedLevels(q) ? decodeLevelsFromUrl(q) : (load(STORAGE_KEY) ?? [...DEFAULT_LEVELS]);
};
export const useLeverState = () => {
  const [levels, setLevels] = useState<number[]>(DEFAULT_LEVELS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activePreset, setActivePreset] = useState<string|null>(null);
  const [comparisonLevels, setComparisonLevels] = useState<number[]|null>(null);
  useEffect(() => {
    setLevels(fromLocation());
    setComparisonLevels(load(COMPARISON_KEY));
    setIsInitialized(true);
    const onPopState = () => { setLevels(fromLocation()); setActivePreset(null); };
    window.addEventListener('popstate',onPopState);
    return () => window.removeEventListener('popstate',onPopState);
  }, []);
  useEffect(() => {
    if (!isInitialized) return;
    const url = new URL(window.location.href);
    const encoded = encodeLevelsToUrl(levels);
    if (url.searchParams.get('levers') !== encoded) {
      url.searchParams.set('levers',encoded);
      window.history.replaceState(window.history.state,'',url.href);
    }
    save(STORAGE_KEY,levels);
  },[levels,isInitialized]);
  const setLevel = useCallback((index:number, level:number) => {
    if (!Number.isInteger(index) || index<0 || index>=levers.length ||
        !Number.isInteger(level) || level<1 || level>4) return;
    setLevels(previous => {
      if (previous[index]===level) return previous;
      const next=[...previous];next[index]=level;return next;
    });
    setActivePreset(null);
  },[]);
  const reset = useCallback(() => { setLevels([...DEFAULT_LEVELS]);setActivePreset(null); },[]);
  const applyPreset = useCallback((preset:PresetScenario) => {
    setLevels(safeLevels(preset.levels));setActivePreset(preset.id);
  },[]);
  const saveForComparison = useCallback(() => {
    save(COMPARISON_KEY,levels);setComparisonLevels([...levels]);
  },[levels]);
  const clearComparison = useCallback(() => {
    try {window.localStorage.removeItem(COMPARISON_KEY);}catch{/* optional */}
    setComparisonLevels(null);
  },[]);
  const getShareUrl = useCallback(() => {
    const url = new URL(window.location.pathname,window.location.origin);
    url.searchParams.set('levers',encodeLevelsToUrl(levels));
    return url.href;
  },[levels]);
  return {levels,setLevel,reset,applyPreset,activePreset,getShareUrl,
    isInitialized,PRESET_SCENARIOS,comparisonLevels,saveForComparison,clearComparison};
};
