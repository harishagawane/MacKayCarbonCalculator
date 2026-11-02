export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  levels: number[];
  icon: string;
}

/**
 * Pre-built scenarios for quick loading.
 * Levels map to the 15 levers in order from levers.ts:
 * 0: travel-demand, 1: light-vehicles, 2: heavy-vehicles, 3: behaviour,
 * 4: efficiency, 5: heating-system, 6: carbon-intensity, 7: carbon-capture,
 * 8: hydrogen, 9: nuclear, 10: wind, 11: solar, 12: wave-tidal,
 * 13: forestry, 14: bioenergy
 */
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'business-as-usual',
    name: 'Business as Usual',
    description: 'Minimal effort across all sectors — emissions remain high',
    icon: '🏭',
    levels: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'government-plan',
    name: 'Illustrative Policy Mix',
    description: 'Example policy mix, not an official government plan or forecast',
    icon: '🏛️',
    levels: [2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 3, 3, 1, 2, 2],
  },
  {
    id: 'tech-optimist',
    name: 'Tech Optimist',
    description: 'Heavy reliance on technology: nuclear, CCS, hydrogen, and electrification',
    icon: '⚛️',
    levels: [2, 4, 3, 1, 2, 4, 3, 4, 4, 4, 3, 4, 3, 1, 3],
  },
  {
    id: 'lifestyle-change',
    name: 'Lifestyle Change',
    description: 'Focus on demand reduction, behaviour change, and nature-based solutions',
    icon: '🌿',
    levels: [4, 2, 2, 4, 4, 3, 2, 1, 1, 2, 3, 3, 1, 4, 4],
  },
  {
    id: 'net-zero-society',
    name: 'Maximum Ambition',
    description: 'All levers at maximum: highest model score, not verified net zero',
    icon: '🌍',
    levels: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    id: 'balanced-pathway',
    name: 'Balanced Pathway',
    description: 'A balanced mix of technology, behaviour, and nature-based solutions',
    icon: '⚖️',
    levels: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
  },
];
