import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
}

export const TravelDemandIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="2" fill="none" />
    <path d="M14 24 Q24 14 34 24 Q24 34 14 24" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="24" cy="24" r="4" fill={color} />
    <path d="M24 8 L24 14 M24 34 L24 40 M8 24 L14 24 M34 24 L40 24" stroke={color} strokeWidth="2" />
  </svg>
);

export const LightVehiclesIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <rect x="8" y="20" width="32" height="14" rx="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 20 L16 12 L32 12 L36 20" stroke={color} strokeWidth="2" fill="none" />
    <rect x="17" y="15" width="8" height="5" fill={color} opacity="0.3" />
    <circle cx="14" cy="34" r="4" fill="#333" />
    <circle cx="34" cy="34" r="4" fill="#333" />
    <circle cx="14" cy="34" r="2" fill="#666" />
    <circle cx="34" cy="34" r="2" fill="#666" />
    <path d="M8 28 L40 28" stroke={color} strokeWidth="1" />
  </svg>
);

export const HeavyVehiclesIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <rect x="4" y="18" width="28" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <rect x="32" y="22" width="12" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M32 22 L36 14 L40 14 L44 22" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="12" cy="34" r="4" fill="#333" />
    <circle cx="24" cy="34" r="4" fill="#333" />
    <circle cx="38" cy="34" r="4" fill="#333" />
    <rect x="6" y="22" width="8" height="6" fill={color} opacity="0.3" />
  </svg>
);

export const BehaviourIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="14" r="6" stroke={color} strokeWidth="2" fill="none" />
    <path d="M24 22 L24 32" stroke={color} strokeWidth="2" />
    <path d="M16 28 L24 22 L32 28" stroke={color} strokeWidth="2" fill="none" />
    <path d="M18 40 L20 32 L24 32 L28 32 L30 40" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="24" cy="14" r="2" fill={color} />
  </svg>
);

export const EfficiencyIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path d="M8 40 L8 20 L20 8 L40 8 L40 40 Z" stroke={color} strokeWidth="2" fill="none" />
    <rect x="12" y="24" width="8" height="8" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="28" y="16" width="8" height="10" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M16 32 L16 40 M32 26 L32 40" stroke={color} strokeWidth="1.5" />
    <path d="M20 12 L20 8 M36 12 L36 8" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const HeatingSystemIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path d="M24 8 Q30 16 24 24 Q18 32 24 40" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M16 12 Q20 18 16 24 Q12 30 16 36" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M32 12 Q36 18 32 24 Q28 30 32 36" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    <circle cx="24" cy="42" r="3" fill={color} />
  </svg>
);

export const CarbonIntensityIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path d="M8 40 L12 20 L20 12 L28 16 L36 10 L40 40 Z" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="24" cy="26" r="8" stroke={color} strokeWidth="2" fill="none" />
    <path d="M18 26 L24 20 L30 26 L24 32 Z" fill={color} />
    <path d="M20 8 L22 4 M28 6 L30 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CarbonCaptureIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="36" rx="16" ry="6" stroke={color} strokeWidth="2" fill="none" />
    <path d="M8 36 L8 28 Q8 20 16 18" stroke={color} strokeWidth="2" fill="none" />
    <path d="M40 36 L40 28 Q40 20 32 18" stroke={color} strokeWidth="2" fill="none" />
    <ellipse cx="24" cy="18" rx="10" ry="4" stroke={color} strokeWidth="2" fill={color} opacity="0.2" />
    <ellipse cx="24" cy="12" rx="6" ry="3" stroke={color} strokeWidth="1.5" fill={color} opacity="0.3" />
    <ellipse cx="24" cy="8" rx="3" ry="1.5" stroke={color} strokeWidth="1" fill={color} opacity="0.4" />
  </svg>
);

export const HydrogenIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <text x="8" y="32" fontSize="20" fontWeight="bold" fill={color}>H</text>
    <text x="24" y="24" fontSize="14" fontWeight="bold" fill={color}>₂</text>
    <circle cx="38" cy="16" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="38" cy="16" r="2" fill={color} />
  </svg>
);

export const NuclearIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <ellipse cx="24" cy="24" rx="16" ry="6" stroke={color} strokeWidth="2" fill="none" />
    <ellipse cx="24" cy="24" rx="16" ry="6" stroke={color} strokeWidth="2" fill="none" transform="rotate(60 24 24)" />
    <ellipse cx="24" cy="24" rx="16" ry="6" stroke={color} strokeWidth="2" fill="none" transform="rotate(120 24 24)" />
    <circle cx="24" cy="24" r="5" fill={color} />
    <circle cx="24" cy="24" r="2" fill="white" />
  </svg>
);

export const WindIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <line x1="24" y1="24" x2="24" y2="44" stroke={color} strokeWidth="3" />
    <ellipse cx="24" cy="24" rx="4" ry="14" stroke={color} strokeWidth="2" fill={color} opacity="0.3" />
    <ellipse cx="24" cy="24" rx="4" ry="14" stroke={color} strokeWidth="2" fill={color} opacity="0.3" transform="rotate(120 24 24)" />
    <ellipse cx="24" cy="24" rx="4" ry="14" stroke={color} strokeWidth="2" fill={color} opacity="0.3" transform="rotate(240 24 24)" />
    <circle cx="24" cy="24" r="4" fill={color} />
  </svg>
);

export const SolarIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="2" fill={color} opacity="0.2" />
    <circle cx="24" cy="24" r="6" fill={color} />
    <line x1="24" y1="4" x2="24" y2="10" stroke={color} strokeWidth="2" />
    <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="2" />
    <line x1="4" y1="24" x2="10" y2="24" stroke={color} strokeWidth="2" />
    <line x1="38" y1="24" x2="44" y2="24" stroke={color} strokeWidth="2" />
    <line x1="10" y1="10" x2="14" y2="14" stroke={color} strokeWidth="2" />
    <line x1="34" y1="34" x2="38" y2="38" stroke={color} strokeWidth="2" />
    <line x1="38" y1="10" x2="34" y2="14" stroke={color} strokeWidth="2" />
    <line x1="14" y1="34" x2="10" y2="38" stroke={color} strokeWidth="2" />
  </svg>
);

export const WaveTidalIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path d="M4 28 Q12 20 20 28 Q28 36 36 28 Q44 20 48 28" stroke={color} strokeWidth="2" fill="none" />
    <path d="M4 36 Q12 28 20 36 Q28 44 36 36 Q44 28 48 36" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M8 16 Q16 8 24 16 Q32 24 40 16" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
  </svg>
);

export const ForestryIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <polygon points="24,4 32,20 16,20" fill={color} opacity="0.8" />
    <polygon points="24,14 34,32 14,32" fill={color} opacity="0.6" />
    <polygon points="24,24 36,44 12,44" fill={color} opacity="0.4" />
    <rect x="22" y="44" width="4" height="4" fill="#5D4037" />
  </svg>
);

export const BioenergyIcon: React.FC<IconProps> = ({ className, color = '#1565C0' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path d="M24 44 Q24 32 28 24 Q32 16 24 8" stroke={color} strokeWidth="2" fill="none" />
    <path d="M24 36 Q18 32 16 26" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M24 28 Q30 24 32 18" stroke={color} strokeWidth="1.5" fill="none" />
    <ellipse cx="24" cy="8" rx="4" ry="6" fill={color} opacity="0.5" />
    <ellipse cx="16" cy="26" rx="3" ry="4" fill={color} opacity="0.4" />
    <ellipse cx="32" cy="18" rx="3" ry="4" fill={color} opacity="0.4" />
  </svg>
);

export const leverIcons: Record<string, React.FC<IconProps>> = {
  'travel-demand': TravelDemandIcon,
  'light-vehicles': LightVehiclesIcon,
  'heavy-vehicles': HeavyVehiclesIcon,
  'behaviour': BehaviourIcon,
  'efficiency': EfficiencyIcon,
  'heating-system': HeatingSystemIcon,
  'carbon-intensity': CarbonIntensityIcon,
  'carbon-capture': CarbonCaptureIcon,
  'hydrogen': HydrogenIcon,
  'nuclear': NuclearIcon,
  'wind': WindIcon,
  'solar': SolarIcon,
  'wave-tidal': WaveTidalIcon,
  'forestry': ForestryIcon,
  'bioenergy': BioenergyIcon,
};
