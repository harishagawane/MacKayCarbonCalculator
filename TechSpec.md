# My2050 Carbon Calculator - Technical Specification

---

## Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| Button | Action buttons, level selectors | Custom colors, sizes |
| Card | Lever cards, result containers | Dark theme styling |
| Dialog | Lever detail modal | Full-screen on mobile |
| Tabs | Results page navigation | Custom underline style |
| Slider | Alternative level selector (optional) | Custom track colors |
| Tooltip | Info hints on lever cards | Dark theme |
| Progress | CO2e meter background | Gradient fill |

### Custom Components to Build

| Component | Purpose | Props |
|-----------|---------|-------|
| CO2Meter | Main emissions gauge | currentValue, targetValue, animated |
| LeverCard | Individual lever control | lever, currentLevel, onLevelChange, onClick |
| LevelSelector | 4-level button group | level, onChange, colors |
| LeverModal | Detailed lever info | lever, currentLevel, isOpen, onClose, onLevelChange |
| CategorySection | Group of lever cards | category, levers, currentLevels |
| ResultsPage | Full results view | leverLevels, onBack, onShare |
| EmissionsChart | CO2e bar chart | data, animated |
| EnergyChart | Energy demand/supply chart | data, animated |
| ScenarioDetails | List of lever descriptions | leverLevels |
| ActionBar | Bottom action buttons | onReset, onResults |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| useLeverState | Manage lever levels state, URL sync |
| useEmissionsCalc | Calculate total emissions from lever levels |
| useScrollReveal | Intersection observer for scroll animations |
| useAnimatedValue | Animate numeric values smoothly |

---

## Animation Implementation Plan

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| CO2e Meter fill | Framer Motion | animate width/scaleX with spring physics | Medium |
| Number counter | Custom hook | useAnimatedValue with requestAnimationFrame | Low |
| Lever card hover | CSS/Tailwind | transform, shadow transitions | Low |
| Level button select | Framer Motion | layoutId for shared element transition | Medium |
| Modal open/close | Framer Motion | AnimatePresence with slide + fade | Medium |
| Page transitions | Framer Motion | AnimatePresence with slide from right | Medium |
| Chart bar growth | Framer Motion | animate height/scaleY with stagger | Medium |
| Scroll reveal | Framer Motion | whileInView with fade + slide up | Low |
| Staggered card entry | Framer Motion | staggerChildren in parent | Low |
| Tab indicator slide | Framer Motion | layoutId for underline | Low |

### Animation Library Rationale

**Framer Motion (Primary)**
- React-native integration
- Declarative animation API
- AnimatePresence for exit animations
- Layout animations for smooth transitions
- whileInView for scroll-triggered animations

**CSS/Tailwind (Secondary)**
- Simple hover states
- Color transitions
- Basic transforms

---

## Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   └── icons/              # Lever category icons
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn components
│   │   ├── CO2Meter.tsx
│   │   ├── LeverCard.tsx
│   │   ├── LevelSelector.tsx
│   │   ├── LeverModal.tsx
│   │   ├── CategorySection.tsx
│   │   ├── ActionBar.tsx
│   │   └── charts/
│   │       ├── EmissionsChart.tsx
│   │       └── EnergyChart.tsx
│   ├── hooks/
│   │   ├── useLeverState.ts
│   │   ├── useEmissionsCalc.ts
│   │   └── useAnimatedValue.ts
│   ├── data/
│   │   ├── levers.ts       # All lever data
│   │   └── calculations.ts # Emissions calculation logic
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── pages/
│   │   ├── MainPage.tsx    # Lever controls page
│   │   └── ResultsPage.tsx # Results visualization
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Dependencies

### Core (Auto-installed)
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Animation
```bash
npm install framer-motion
```

### Charts
```bash
npm install recharts
```

### Icons
```bash
npm install lucide-react
```

### Utilities
```bash
npm install clsx tailwind-merge
```

---

## State Management

### Lever State
```typescript
// URL-encoded string of 15 digits (1-4)
// Example: "111111111111111" = all level 1
// Example: "444444444444444" = all level 4

type LeverState = {
  levels: number[]; // 15 elements, each 1-4
  setLevel: (index: number, level: number) => void;
  reset: () => void;
  encodeToUrl: () => string;
  decodeFromUrl: (encoded: string) => void;
};
```

### Emissions Calculation
```typescript
// Each lever contributes a percentage reduction
// Total = sum of all lever impacts (capped at 100%)

interface EmissionsResult {
  totalReduction: number; // 0-100%
  remainingEmissions: number; // Megatonnes CO2e
  categoryBreakdown: {
    transport: number;
    buildings: number;
    industry: number;
    electricity: number;
    land: number;
  };
}
```

---

## URL Parameter Schema

```
?levers={15-digit-string}

Each digit represents a lever (1-4):
Position 1: Travel Demand
Position 2: Light Vehicles
Position 3: Heavy Vehicles
Position 4: Behaviour
Position 5: Efficiency
Position 6: Heating System
Position 7: Carbon Intensity
Position 8: Carbon Capture
Position 9: Hydrogen
Position 10: Nuclear
Position 11: Wind
Position 12: Solar
Position 13: Wave & Tidal
Position 14: Forestry
Position 15: Bioenergy
```

---

## Performance Considerations

1. **Animation Performance**
   - Use `transform` and `opacity` only
   - Apply `will-change` sparingly
   - Respect `prefers-reduced-motion`

2. **Chart Performance**
   - Use Recharts with `isAnimationActive` toggle
   - Debounce rapid lever changes

3. **State Updates**
   - Batch lever changes
   - Use memoization for calculations

4. **Bundle Size**
   - Tree-shake Framer Motion imports
   - Lazy load ResultsPage

---

## Accessibility

1. **Keyboard Navigation**
   - All levers accessible via keyboard
   - Tab order follows visual layout
   - Enter/Space to open modal

2. **Screen Readers**
   - ARIA labels on all interactive elements
   - Live region for CO2e meter updates
   - Descriptive labels for level buttons

3. **Visual**
   - Minimum 4.5:1 contrast ratio
   - Color not sole indicator (icons + text)
   - Focus indicators visible

---
