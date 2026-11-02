import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { getFreightCargoInfo } from '@/data/calculations';

interface IsometricBackgroundProps {
  levels: number[];
  /** Prioritise visibility of the road and railway when the controls are open. */
  foregroundFocus?: boolean;
}

export const IsometricBackground = ({ levels, foregroundFocus = false }: IsometricBackgroundProps) => {
  const reduceMotion = useReducedMotion();
  const animationRepeat = reduceMotion ? 0 : Infinity;
  const windLevel = levels[10];
  const solarLevel = levels[11];
  const forestryLevel = levels[13];
  const lightVehiclesLevel = levels[1];
  const heavyVehiclesLevel = levels[2];
  const carbonCaptureLevel = levels[7];
  const nuclearLevel = levels[9];
  const waveTidalLevel = levels[12];

  // Shared with the Results page so the scene and the data always agree.
  const freightCargo = getFreightCargoInfo(levels).id;
  
  const windTurbines = windLevel;
  const solarPanels = Math.ceil(solarLevel / 2);
  const trees = forestryLevel * 4;

  // Shared animated wheel (spokes + hub) for the freight fleet and trucks.
  const spokedWheel = (cx: number, cy: number, r: number, dur: number) => (
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: dur, repeat: animationRepeat, ease: 'linear' }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#17202A" />
      <line x1={cx - r + 1.5} y1={cy} x2={cx + r - 1.5} y2={cy} stroke="#85929E" strokeWidth="0.8" />
      <line x1={cx} y1={cy - r + 1.5} x2={cx} y2={cy + r - 1.5} stroke="#85929E" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={Math.max(1, r * 0.3)} fill="#E5E7E9" />
    </motion.g>
  );

  // Cargo stacked on freight wagons — picked from the other policy levers.
  const cargoStack = (cargo: string) => {
    switch (cargo) {
      case 'biomass':
        return (
          <g>
            {[0, 1, 2].map(i => (
              <ellipse key={i} cx={11 + i * 17} cy={-7} rx={8} ry={5.5} fill={i % 2 ? '#58D68D' : '#27AE60'} stroke="#1E8449" strokeWidth="0.7" />
            ))}
            <rect x="4" y="-3.5" width="48" height="3.5" rx="1" fill="#1E8449" />
          </g>
        );
      case 'hydrogen':
        return (
          <g>
            {[0, 1].map(i => (
              <g key={i}>
                <rect x={6 + i * 26} y={-21} width="21" height="13" rx="6.5" fill="#D5DBDB" stroke="#85929E" strokeWidth="0.8" />
                <rect x={6 + i * 26} y={-16.5} width="6" height="4.5" rx="2" fill="#5DADE2" />
                <text x={16.5 + i * 26} y={-10} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#34495E">H₂</text>
              </g>
            ))}
            <rect x="2" y="-4" width="52" height="4" rx="1" fill="#7F8C8D" />
          </g>
        );
      case 'timber':
        return (
          <g>
            {[0, 1, 2, 3].map(i => (
              <ellipse key={i} cx={10 + i * 12} cy={-9 + (i % 2) * 4.5} rx={5.5} ry={5} fill={i % 2 ? '#A1887F' : '#8D6E63'} stroke="#6D4C41" strokeWidth="0.6" />
            ))}
            <rect x="2" y="-3" width="52" height="3" rx="1" fill="#5D4037" />
          </g>
        );
      case 'coal':
        return (
          <g>
            <path d="M4 -6 Q16 -19 30 -6 L30 -2 L4 -2 Z" fill="#4D5656" />
            <path d="M22 -8 Q35 -19 48 -8 L48 -2 L22 -2 Z" fill="#34495E" />
            <path d="M8 -2 Q20 -10 32 -2 L32 2 L8 2 Z" fill="#2C3E50" />
          </g>
        );
      default: // containers
        return (
          <g>
            <rect x="3" y="-17" width="20" height="15" rx="1" fill="#E67E22" />
            <rect x="25" y="-14" width="16" height="12" rx="1" fill="#2E86C1" />
            <rect x="43" y="-17" width="11" height="15" rx="1" fill="#F1C40F" />
          </g>
        );
    }
  };

  // A road truck — diesel in the present day, electric/hydrogen livery at level 4.
  const truckShape = (clean: boolean, scale = 1) => (
    <g transform={`scale(${scale})`}>
      {/* Container trailer */}
      <rect x="20" y="-16" width="44" height="17" rx="1.5" fill={clean ? '#A3E4D7' : '#7D3C98'} />
      <rect x="23" y="-20" width="38" height="5" rx="1" fill={clean ? '#58D68D' : '#A569BD'} />
      {/* Cab */}
      <path d="M0 -12 L20 -12 L20 4 L0 4 Z" fill={clean ? '#16A085' : '#5D6D7E'} />
      <path d="M5 -10 L12 -10 L12 2 L5 2 Z" fill={clean ? '#D1F2EB' : '#BFC9CA'} />
      {/* Wheels */}
      {spokedWheel(10, 6, 4, 0.5)}
      {spokedWheel(58, 6, 4, 0.5)}
    </g>
  );

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      <div
        className="immersive-scene absolute inset-0 overflow-hidden transition-[filter] duration-700 dark:brightness-[0.68] dark:saturate-[0.85]"
        style={{
          // Keep the panoramic viewport filled at every aspect ratio.
          background: 'linear-gradient(180deg,#6b9ec3 0%,#b6d9dd 55%,#8bbd9b 66%,#4a976a 100%)',
        }}
      >
        <svg
          viewBox="0 0 1200 700"
          className="h-full w-full"
          data-scene-motion="true"
          preserveAspectRatio={foregroundFocus ? 'xMidYMax slice' : 'xMidYMid slice'}
        >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6B9FC5" />
            <stop offset="52%" stopColor="#A8D0DC" />
            <stop offset="100%" stopColor="#E7DEBF" />
          </linearGradient>
          
          {/* Grass gradient */}
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#82B98E" />
            <stop offset="48%" stopColor="#65AE80" />
            <stop offset="100%" stopColor="#3F8A68" />
          </linearGradient>
          
          {/* Water gradient */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8ECCE0" />
            <stop offset="45%" stopColor="#4F9DBB" />
            <stop offset="100%" stopColor="#246F97" />
          </linearGradient>
          
          {/* Sun glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F9E79F" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F7DC6F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4D03F" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mountainHaze" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B7CFC2" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#70A98B" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="atmosphereOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff5d9" stopOpacity="0.08" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#142c39" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient id="softSunHalo">
            <stop offset="0%" stopColor="#fff9cf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff9cf" stopOpacity="0" />
          </radialGradient>
          <filter id="cloudDiffusion" x="-15%" y="-50%" width="130%" height="200%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
          <filter id="subtleDepth" x="-25%" y="-25%" width="150%" height="160%">
            <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#173a48" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {/* Sky */}
        <rect width="1200" height="700" fill="url(#skyGradient)" />
        
        {/* Soft high-altitude haze that adds depth behind all moving objects */}
        <circle cx="95" cy="68" r="180" fill="url(#softSunHalo)" opacity="0.8" />
        {/* Sun with animated rays */}
        <g transform="translate(80, 60)">
          {/* Rotating sun rays */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: animationRepeat, ease: "linear" }}
          >
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="0" y1="0" 
                x2={Math.cos(i * 45 * Math.PI / 180) * 70} 
                y2={Math.sin(i * 45 * Math.PI / 180) * 70}
                stroke="#F9E79F"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
          </motion.g>
          
          {/* Sun glow */}
          <circle r="50" fill="url(#sunGlow)" />
          
          {/* Sun core */}
          <motion.circle 
            r="30" 
            fill="#F4D03F"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: animationRepeat, ease: "easeInOut" }}
          />
        </g>
        
        {/* Floating greenhouse gas particles */}
        {['CO₂', 'CH₄', 'N₂O'].map((gas, gasIndex) => (
          [...Array(3)].map((_, i) => (
            <motion.g
              key={`${gas}-${i}`}
              initial={{ 
                x: 200 + gasIndex * 300 + i * 80, 
                y: 500 + i * 50,
                opacity: 0.3
              }}
              animate={{ 
                y: [500 + i * 50, 300 + i * 30, 500 + i * 50],
                x: [200 + gasIndex * 300 + i * 80, 220 + gasIndex * 300 + i * 80, 200 + gasIndex * 300 + i * 80],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: animationRepeat, 
                ease: "easeInOut",
                delay: i * 1.5 + gasIndex * 0.5
              }}
            >
              <rect x="-20" y="-12" width="40" height="24" rx="4" fill="white" opacity="0.8" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#5D6D7E">
                {gas}
              </text>
            </motion.g>
          ))
        ))}
        
        {/* Animated birds with flapping wings */}
        {[...Array(4)].map((_, i) => (
          <motion.g 
            key={i}
            initial={{ x: -50, y: 80 + i * 40 }}
            animate={{ 
              x: 1250,
              y: [80 + i * 40, 62 + i * 40, 80 + i * 40]
            }}
            transition={{ 
              duration: 28 + i * 6, 
              repeat: animationRepeat, 
              ease: "linear",
              delay: i * 7
            }}
          >
            {/* Body */}
            <ellipse cx="0" cy="0" rx="9" ry="3" fill="#2C3E50" />
            {/* Head */}
            <circle cx="7" cy="-2" r="2.8" fill="#2C3E50" />
            {/* Beak */}
            <polygon points="9.5,-2.8 13,-1.8 9.5,-1" fill="#E67E22" />
            {/* Tail */}
            <polygon points="-8,0 -13,2 -13,-1.5" fill="#2C3E50" />
            {/* Far wing (behind body) */}
            <motion.g
              style={{ transformOrigin: '2px -1px' }}
              animate={{ rotate: [-40, 34, -40] }}
              transition={{ duration: 0.55, repeat: animationRepeat, ease: "easeInOut", delay: i * 0.13 }}
            >
              <path d="M2 -1 Q-5 -10 -14 -8 Q-2 -3 2 -1 Z" fill="#5D6D7E" opacity="0.85" />
            </motion.g>
            {/* Near wing */}
            <motion.g
              style={{ transformOrigin: '2px -1px' }}
              animate={{ rotate: [-40, 34, -40] }}
              transition={{ duration: 0.55, repeat: animationRepeat, ease: "easeInOut", delay: i * 0.13 }}
            >
              <path d="M2 -1 Q-6 -12 -15 -10 Q-3 -3 2 -1 Z" fill="#2C3E50" />
            </motion.g>
          </motion.g>
        ))}
        
        {/* Clouds - continuous drift with parallax and wind influence */}
        <g opacity="0.78" filter="url(#cloudDiffusion)">
          {[
            { y: 90, s: 1, dur: 80, start: 340 },
            { y: 50, s: 1.35, dur: 115, start: 640 },
            { y: 115, s: 0.75, dur: 66, start: 900 },
            { y: 72, s: 1.1, dur: 98, start: 150 },
          ].map((c, i) => (
            <motion.g
              key={i}
              initial={{ x: c.start, y: c.y }}
              animate={{
                x: [c.start, 1750, -400, c.start],
                y: [c.y, c.y - 6, c.y, c.y - 6],
              }}
              transition={{
                x: {
                  duration: c.dur / (1 + windLevel * 0.1),
                  repeat: animationRepeat,
                  times: [0, 0.4, 0.44, 1],
                  ease: "linear",
                },
                y: { duration: 26 + i * 7, repeat: animationRepeat, ease: "easeInOut" },
              }}
            >
              <g transform={`scale(${c.s})`}>
                <ellipse cx="250" cy="0" rx="60" ry="28" fill="white" />
                <ellipse cx="290" cy="-14" rx="45" ry="22" fill="white" />
                <ellipse cx="210" cy="-10" rx="40" ry="20" fill="white" />
              </g>
            </motion.g>
          ))}
        </g>
        
        {/* Distant misty hills and atmospheric perspective */}
        <path d="M0 345 Q100 310 190 336 Q340 273 495 332 Q635 290 760 330 Q910 270 1070 321 Q1155 298 1200 320 V700 H0 Z" fill="url(#mountainHaze)" opacity="0.65" />
        <path d="M0 375 Q185 334 295 351 Q460 320 610 357 Q800 304 950 350 Q1080 325 1200 350 V700 H0 Z" fill="#96C4A0" opacity="0.65" />
        {/* Background hills */}
        <path d="M0 380 Q250 300 500 360 T1000 340 V700 H0 Z" fill="#82C999" />
        
        {/* Wind turbines - white 3-blade design */}
        {windTurbines >= 1 && (
          <g>
            {[0, 1, 2].map(i => (
              <g key={i} transform={`translate(${100 + i * 100}, ${240 + i * 10})`}>
                {/* Tower */}
                <rect x="-3" y="0" width="6" height="100" fill="#ECF0F1" />
                
                {/* Nacelle */}
                <ellipse cx="0" cy="0" rx="8" ry="5" fill="#BDC3C7" />
                
                {/* Rotating blades */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: (windLevel <= 2 ? 5 : windLevel === 3 ? 3 : 2) + i * 0.35,
                    repeat: animationRepeat,
                    delay: i * 0.25,
                    ease: "linear",
                  }}
                >
                  {/* Blade 1 */}
                  <ellipse cx="0" cy="-45" rx="6" ry="45" fill="white" stroke="#BDC3C7" strokeWidth="1" />
                  {/* Blade 2 */}
                  <ellipse cx="39" cy="22" rx="6" ry="45" fill="white" stroke="#BDC3C7" strokeWidth="1" transform="rotate(120 39 22)" />
                  {/* Blade 3 */}
                  <ellipse cx="-39" cy="22" rx="6" ry="45" fill="white" stroke="#BDC3C7" strokeWidth="1" transform="rotate(240 -39 22)" />
                </motion.g>
                
                {/* Hub */}
                <circle cx="0" cy="0" r="5" fill="#95A5A6" />
                
                {/* Shadow */}
                <ellipse cx="0" cy="100" rx="25" ry="6" fill="black" opacity="0.1" />
              </g>
            ))}
          </g>
        )}
        
        {/* Main landscape */}
        <path d="M0 420 Q350 360 700 390 T1200 370 V700 H0 Z" fill="url(#grassGradient)" />
        
        {/* River */}
        <path d="M550 400 Q650 430 750 410 Q850 390 950 420 L1050 700 H900 L800 480 Q750 460 700 480 Q650 500 600 480 Z" fill="url(#waterGradient)" />
        
        {/* Water ripples */}
        {[...Array(6)].map((_, i) => (          <motion.ellipse
            key={i}
            cx={600 + i * 60}
            cy={460 + (i % 3) * 15}
            rx={18}
            ry={4}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.5"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.2, 0.3], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 3,
              repeat: animationRepeat,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
        
        {/* River glints - dancing light reflections */}
        {[...Array(7)].map((_, i) => (
          <motion.ellipse
            key={`glint-${i}`}
            cx={640 + i * 48}
            cy={505 + (i % 3) * 14}
            rx={7 + (i % 2) * 3}
            ry={1.8}
            fill="#D4E6F1"
            animate={{ opacity: [0, 0.75, 0], x: [0, 4, 0] }}
            transition={{ duration: 2.2 + (i % 4) * 0.7, repeat: animationRepeat, ease: "easeInOut", delay: i * 0.45 }}
          />
        ))}
        
        {/* City buildings */}
        <g transform="translate(40, 320)" filter="url(#subtleDepth)">
          {/* Building 1 */}
          <path d="M0 90 L35 70 L35 0 L0 20 Z" fill="#5DADE2" />
          <path d="M35 70 L70 90 L70 20 L35 0 Z" fill="#3498DB" />
          <path d="M0 20 L35 0 L70 20 L35 40 Z" fill="#85C1E9" />
          
          {/* Windows with random lighting */}
          {[0, 1, 2].map(row => 
            [0, 1].map(col => (
              <motion.rect 
                key={`b1-${row}-${col}`}
                x={8 + col * 22} 
                y={25 + row * 20} 
                width="10" 
                height="12" 
                fill="#FEF9E7"                  animate={{
                    fill: (row + col) % 3 === 0 ? '#D6EAF8' : ['#FEF9E7', '#F4D03F', '#FEF9E7']
                  }}
                  transition={{
                    duration: 4 + ((row * 2 + col) % 3),
                    repeat: animationRepeat,
                    delay: (row + col) * 0.5
                  }}
              />
            ))
          )}
          
          {/* Building 2 - taller */}
          <g transform="translate(55, -25)">
            <path d="M0 115 L40 90 L40 -15 L0 10 Z" fill="#AED6F1" />
            <path d="M40 90 L80 115 L80 10 L40 -15 Z" fill="#5DADE2" />
            <path d="M0 10 L40 -15 L80 10 L40 35 Z" fill="#D6EAF8" />
            
            {/* Windows grid */}
            {[0, 1, 2, 3].map(row => 
              [0, 1].map(col => (
                <motion.rect 
                  key={`b2-${row}-${col}`}
                  x={12 + col * 28} 
                  y={15 + row * 22} 
                  width="12" 
                  height="14" 
                  fill="#FEF9E7"
                  animate={{
                    fill: (row + col) % 2 === 0 ? ['#FEF9E7', '#F4D03F', '#FEF9E7'] : '#D6EAF8'
                  }}
                  transition={{
                    duration: 3 + ((row + col) % 4),
                    repeat: animationRepeat,
                    delay: (row * 0.6) + (col * 0.35)
                  }}
                />
              ))
            )}
          </g>
          
          {/* Building 3 */}
          <g transform="translate(130, 15)">
            <path d="M0 75 L30 55 L30 10 L0 30 Z" fill="#5499C7" />
            <path d="M30 55 L60 75 L60 30 L30 10 Z" fill="#2E86C1" />
            <path d="M0 30 L30 10 L60 30 L30 50 Z" fill="#7FB3D5" />
          </g>
        </g>
        
        {/* Road */}
        <path d="M180 460 L480 440 L880 480 L1100 700 L80 700 Z" fill="#7F8C8D" />
        <path d="M230 480 L260 478" stroke="#F4F6F7" strokeWidth="3" strokeDasharray="15 12" />
        <path d="M330 475 L430 468" stroke="#F4F6F7" strokeWidth="3" strokeDasharray="15 12" />
        <path d="M530 470 L730 485" stroke="#F4F6F7" strokeWidth="3" strokeDasharray="15 12" />
        
        {/* Moving vehicles */}
        {lightVehiclesLevel >= 2 && (
          <motion.g
            initial={{ x: 220, opacity: 0 }}
            animate={{
              x: [220, 360, 560, 720],
              y: [0, -1, 0, 1],
              opacity: [0, 1, 1, 0],
            }}            transition={{ duration: 18, repeat: animationRepeat, ease: "linear" }}
          >
            <g transform="translate(280, 460)">
              {/* Green electric car */}
              <path d="M0 12 L28 8 L45 12 L45 22 L28 26 L0 22 Z" fill="#27AE60" />
              <rect x="5" y="10" width="14" height="8" fill="#58D68D" />
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.45, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '10px 22px' }}>
                <circle cx="10" cy="22" r="3.5" fill="#2C3E50" />
                <line x1="10" y1="18.5" x2="10" y2="25.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="6.5" y1="22" x2="13.5" y2="22" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="10" cy="22" r="1.1" fill="#E5E7E9" />
              </motion.g>
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.45, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '35px 22px' }}>
                <circle cx="35" cy="22" r="3.5" fill="#2C3E50" />
                <line x1="35" y1="18.5" x2="35" y2="25.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="31.5" y1="22" x2="38.5" y2="22" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="35" cy="22" r="1.1" fill="#E5E7E9" />
              </motion.g>
              {/* Headlight */}
              <motion.ellipse cx="43" cy="16" rx="2.5" ry="1.5" fill="#F4D03F" 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: animationRepeat }}
              />
            </g>
          </motion.g>
        )}
        
        {lightVehiclesLevel >= 3 && (
          <motion.g
            initial={{ x: 220, opacity: 0 }}
            animate={{
              x: [220, 360, 560, 720],
              y: [0, 1, 0, -1],
              opacity: [0, 1, 1, 0],
            }}            transition={{ duration: 21, repeat: animationRepeat, ease: "linear", delay: 4 }}
          >
            <g transform="translate(420, 470)">
              {/* Blue electric car */}
              <path d="M0 12 L32 9 L50 12 L50 24 L32 27 L0 24 Z" fill="#3498DB" />
              <rect x="7" y="10" width="16" height="9" fill="#5DADE2" />
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.48, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '12px 24px' }}>
                <circle cx="12" cy="24" r="4" fill="#2C3E50" />
                <line x1="12" y1="19.5" x2="12" y2="28.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="7.5" y1="24" x2="16.5" y2="24" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="12" cy="24" r="1.2" fill="#E5E7E9" />
              </motion.g>
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.48, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '40px 24px' }}>
                <circle cx="40" cy="24" r="4" fill="#2C3E50" />
                <line x1="40" y1="19.5" x2="40" y2="28.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="35.5" y1="24" x2="44.5" y2="24" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="40" cy="24" r="1.2" fill="#E5E7E9" />
              </motion.g>
              <motion.ellipse cx="48" cy="17" rx="2.5" ry="1.5" fill="#F4D03F"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: animationRepeat }}
              />
            </g>
          </motion.g>
        )}
        
        {lightVehiclesLevel === 1 && (
          <motion.g
            initial={{ x: -220, opacity: 0 }}
            animate={{
              x: [-220, -40, 180, 420],
              y: [0, -0.5, 0, 1],
              opacity: [0, 1, 1, 0],
            }}            transition={{ duration: 20, repeat: animationRepeat, ease: "linear", delay: 2 }}
          >
            <g transform="translate(560, 490)">
              {/* Red gas car */}
              <path d="M0 12 L32 9 L50 12 L50 24 L32 27 L0 24 Z" fill="#E74C3C" />
              <rect x="7" y="10" width="16" height="9" fill="#EC7063" />
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.48, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '12px 24px' }}>
                <circle cx="12" cy="24" r="4" fill="#2C3E50" />
                <line x1="12" y1="19.5" x2="12" y2="28.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="7.5" y1="24" x2="16.5" y2="24" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="12" cy="24" r="1.2" fill="#E5E7E9" />
              </motion.g>
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.48, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '40px 24px' }}>
                <circle cx="40" cy="24" r="4" fill="#2C3E50" />
                <line x1="40" y1="19.5" x2="40" y2="28.5" stroke="#AEB6BF" strokeWidth="0.7" />
                <line x1="35.5" y1="24" x2="44.5" y2="24" stroke="#AEB6BF" strokeWidth="0.7" />
                <circle cx="40" cy="24" r="1.2" fill="#E5E7E9" />
              </motion.g>
              {/* Exhaust smoke */}
              <motion.g
                animate={{ x: [-8, -18], opacity: [0.7, 0], scale: [1, 1.5] }}
                transition={{ duration: 1.5, repeat: animationRepeat }}
              >
                <circle cx="-5" cy="20" r="3" fill="#95A5A6" opacity="0.6" />
              </motion.g>
            </g>
          </motion.g>
        )}
        
        {/* Counter-direction truck traffic — heavy vehicles lever; clean electric/hydrogen at level 4 */}
        {heavyVehiclesLevel >= 2 && (
          <motion.g
            initial={{ x: 800, opacity: 0 }}
            animate={{
              x: [800, 580, 330, 150],
              y: [0, 1, 0, -1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 24, repeat: animationRepeat, ease: 'linear', delay: 4 }}
          >
            <g transform="translate(680, 450)">
              {truckShape(heavyVehiclesLevel >= 4)}
            </g>
          </motion.g>
        )}

        {heavyVehiclesLevel >= 3 && (
          <motion.g
            initial={{ x: 860, opacity: 0 }}
            animate={{
              x: [860, 640, 380, 170],
              y: [0, 1, 0, -1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 30, repeat: animationRepeat, ease: 'linear', delay: 14 }}
          >
            <g transform="translate(760, 472)">
              {truckShape(heavyVehiclesLevel >= 4, 1.12)}
            </g>
          </motion.g>
        )}

        {/* Train tracks - always part of the landscape */}
        <g transform="translate(80, 560)">
          <rect x="0" y="0" width="800" height="7" fill="#5D4037" />
          <rect x="0" y="18" width="800" height="7" fill="#5D4037" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <rect key={i} x={i * 100} y="0" width="7" height="57" fill="#3E2723" />
          ))}
          <rect x="0" y="32" width="800" height="7" fill="#5D4037" />
          <rect x="0" y="50" width="800" height="7" fill="#5D4037" />

          {/* Train - diesel freight at level 1, electric passenger rail at level 2+, faster as the lever rises */}
          {heavyVehiclesLevel <= 1 ? (
            <motion.g
              initial={{ x: 40, opacity: 0 }}
              animate={{
                x: [40, 160, 360, 600],
                y: [0, -1, 0, 1],
                opacity: [0, 1, 1, 0],
              }}            transition={{ duration: 34, repeat: animationRepeat, ease: "linear" }}
            >
              <g transform="translate(0, -12)">
                {/* Diesel engine */}
                <g>
                  <rect x="0" y="0" width="62" height="22" rx="3" fill="#4A5A65" />
                  <rect x="0" y="0" width="14" height="22" rx="3" fill="#2E3B44" />
                  <motion.circle cx="10" cy="11" r="3" fill="#F4D03F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: animationRepeat, ease: "easeInOut" }} />
                  <rect x="20" y="3" width="16" height="9" rx="1" fill="#85929E" />
                  <rect x="40" y="3" width="16" height="9" rx="1" fill="#85929E" />
                  {/* Exhaust chimney + smoke */}
                  <rect x="30" y="-7" width="5" height="7" fill="#2E3B44" />
                  <motion.g
                    animate={{ y: [-7, -18], opacity: [0.6, 0], scale: [1, 1.6] }}
                    transition={{ duration: 1.4, repeat: animationRepeat, ease: "easeOut" }}
                  >
                    <circle cx="32.5" cy="-7" r="2.5" fill="#BFC9CA" />
                  </motion.g>
                  <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '12px 22px' }}>
                    <circle cx="12" cy="22" r="5" fill="#17202A" />
                    <line x1="12" y1="17.5" x2="12" y2="26.5" stroke="#85929E" strokeWidth="0.9" />
                    <line x1="7.5" y1="22" x2="16.5" y2="22" stroke="#85929E" strokeWidth="0.9" />
                    <circle cx="12" cy="22" r="1.6" fill="#E5E7E9" />
                  </motion.g>
                  <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '50px 22px' }}>
                    <circle cx="50" cy="22" r="5" fill="#17202A" />
                    <line x1="50" y1="17.5" x2="50" y2="26.5" stroke="#85929E" strokeWidth="0.9" />
                    <line x1="45.5" y1="22" x2="54.5" y2="22" stroke="#85929E" strokeWidth="0.9" />
                    <circle cx="50" cy="22" r="1.6" fill="#E5E7E9" />
                  </motion.g>
                </g>
                {/* Freight wagons */}
                {[0, 1].map((w, wi) => (
                  <motion.g key={w} animate={{ x: [0, 1.2, 0, -1.2, 0] }} transition={{ duration: 3, repeat: animationRepeat, ease: "easeInOut", delay: 0.5 + wi * 0.3 }}>
                    <g transform={`translate(${72 + wi * 68}, 0)`}>
                      <rect x="0" y="0" width="60" height="20" rx="2" fill="#8D6E63" />
                      <rect x="0" y="0" width="60" height="10" rx="2" fill="#A1887F" />
                      <rect x="6" y="3" width="48" height="4" rx="1" fill="#6D4C41" />
                      <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.58, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '12px 22px' }}>
                        <circle cx="12" cy="22" r="4.5" fill="#17202A" />
                        <line x1="12" y1="18" x2="12" y2="26" stroke="#85929E" strokeWidth="0.8" />
                        <line x1="8" y1="22" x2="16" y2="22" stroke="#85929E" strokeWidth="0.8" />
                        <circle cx="12" cy="22" r="1.4" fill="#E5E7E9" />
                      </motion.g>
                      <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.58, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '48px 22px' }}>
                        <circle cx="48" cy="22" r="4.5" fill="#17202A" />
                        <line x1="48" y1="18" x2="48" y2="26" stroke="#85929E" strokeWidth="0.8" />
                        <line x1="44" y1="22" x2="52" y2="22" stroke="#85929E" strokeWidth="0.8" />
                        <circle cx="48" cy="22" r="1.4" fill="#E5E7E9" />
                      </motion.g>
                    </g>
                  </motion.g>
                ))}
              </g>
            </motion.g>
          ) : (
            <motion.g
              initial={{ x: 40, opacity: 0 }}
              animate={{
                x: heavyVehiclesLevel >= 3 ? [40, 150, 340, 540] : [40, 160, 360, 600],
                y: [0, -1, 0, 1],
                opacity: [0, 1, 1, 0],
              }}            transition={{ duration: 30 - heavyVehiclesLevel * 3, repeat: animationRepeat, ease: "linear" }}
            >
              <g transform="translate(0, -12)">
                {/* Electric engine */}
                <g>
                  <rect x="0" y="0" width="66" height="22" rx="3" fill="#1B4F72" />
                  <rect x="0" y="0" width="15" height="22" rx="3" fill="#154360" />
                  <motion.circle cx="10" cy="11" r="3" fill="#F4D03F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: animationRepeat, ease: "easeInOut" }} />
                  <rect x="22" y="3" width="15" height="8" rx="1" fill="#AED6F1" />
                  <rect x="42" y="3" width="18" height="8" rx="1" fill="#AED6F1" />
                  <line x1="36" y1="0" x2="42" y2="-9" stroke="#85929E" strokeWidth="1.5" />
                  <line x1="42" y1="-9" x2="48" y2="-9" stroke="#85929E" strokeWidth="1.5" />
                  <motion.circle cx="48" cy="-9" r="2.5" fill="#F4D03F" animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: animationRepeat, repeatDelay: 1.4 }} />
                  <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '12px 22px' }}>
                    <circle cx="12" cy="22" r="5" fill="#17202A" />
                    <line x1="12" y1="17.5" x2="12" y2="26.5" stroke="#85929E" strokeWidth="0.9" />
                    <line x1="7.5" y1="22" x2="16.5" y2="22" stroke="#85929E" strokeWidth="0.9" />
                    <circle cx="12" cy="22" r="1.6" fill="#E5E7E9" />
                  </motion.g>
                  <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '54px 22px' }}>
                    <circle cx="54" cy="22" r="5" fill="#17202A" />
                    <line x1="54" y1="17.5" x2="54" y2="26.5" stroke="#85929E" strokeWidth="0.9" />
                    <line x1="49.5" y1="22" x2="58.5" y2="22" stroke="#85929E" strokeWidth="0.9" />
                    <circle cx="54" cy="22" r="1.6" fill="#E5E7E9" />
                  </motion.g>
                </g>
                {/* Passenger carriages - count grows with the level */}
                {[...Array(heavyVehiclesLevel >= 3 ? 3 : 2)].map((_, ci) => (
                  <motion.g key={ci} animate={{ x: ci % 2 ? [0, -1.6, 0, 1.6, 0] : [0, 1.6, 0, -1.6, 0] }} transition={{ duration: 3 + ci * 0.2, repeat: animationRepeat, ease: "easeInOut", delay: 0.4 + ci * 0.4 }}>
                    <g transform={`translate(${78 + ci * 66}, 0)`}>
                      <rect x="0" y="0" width="58" height="20" rx="2" fill={ci % 2 ? '#85C1E9' : '#5DADE2'} />
                      <rect x="6" y="3" width="15" height="9" rx="1" fill={ci % 2 ? '#EBF5FB' : '#D6EAF8'} />
                      <rect x="25" y="3" width="15" height="9" rx="1" fill={ci % 2 ? '#EBF5FB' : '#D6EAF8'} />
                      <rect x="44" y="3" width="9" height="9" rx="1" fill={ci % 2 ? '#EBF5FB' : '#D6EAF8'} />
                      <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.52, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '10px 22px' }}>
                        <circle cx="10" cy="22" r="4.5" fill="#17202A" />
                        <line x1="10" y1="18" x2="10" y2="26" stroke="#85929E" strokeWidth="0.8" />
                        <line x1="6" y1="22" x2="14" y2="22" stroke="#85929E" strokeWidth="0.8" />
                        <circle cx="10" cy="22" r="1.4" fill="#E5E7E9" />
                      </motion.g>
                      <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.52, repeat: animationRepeat, ease: "linear" }} style={{ transformOrigin: '48px 22px' }}>
                        <circle cx="48" cy="22" r="4.5" fill="#17202A" />
                        <line x1="48" y1="18" x2="48" y2="26" stroke="#85929E" strokeWidth="0.8" />
                        <line x1="44" y1="22" x2="52" y2="22" stroke="#85929E" strokeWidth="0.8" />
                        <circle cx="48" cy="22" r="1.4" fill="#E5E7E9" />
                      </motion.g>
                    </g>
                  </motion.g>
                ))}
              </g>
            </motion.g>
          )}

          {/* Counter-direction freight train on the inbound (foreground) track — cargo reflects the other levers */}
          <motion.g
            initial={{ x: 760, opacity: 0 }}
            animate={{
              x: [760, 560, 340, 120],
              y: [0, 1, 0, -1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 28 - heavyVehiclesLevel * 2, repeat: animationRepeat, ease: 'linear', delay: 5 }}
          >
            <g transform="translate(0, 26)">
              {/* Engine — diesel at level 1, electric at 2-3, hydrogen livery at 4 */}
              {heavyVehiclesLevel >= 4 ? (
                <g>
                  <rect x="0" y="0" width="58" height="22" rx="3" fill="#117A65" />
                  <rect x="0" y="0" width="14" height="22" rx="3" fill="#0E6251" />
                  <motion.circle cx="10" cy="11" r="3" fill="#F4D03F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: animationRepeat, ease: 'easeInOut' }} />
                  <rect x="20" y="3" width="14" height="8" rx="1" fill="#A3E4D7" />
                  <rect x="38" y="3" width="14" height="8" rx="1" fill="#A3E4D7" />
                  <text x="42" y="-2" fontSize="6" fontWeight="bold" fill="#D1F2EB">H₂</text>
                  {spokedWheel(12, 22, 5, 0.45)}
                  {spokedWheel(46, 22, 5, 0.45)}
                </g>
              ) : heavyVehiclesLevel >= 2 ? (
                <g>
                  <rect x="0" y="0" width="58" height="22" rx="3" fill="#1B4F72" />
                  <rect x="0" y="0" width="14" height="22" rx="3" fill="#154360" />
                  <motion.circle cx="10" cy="11" r="3" fill="#F4D03F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: animationRepeat, ease: 'easeInOut' }} />
                  <rect x="20" y="3" width="14" height="8" rx="1" fill="#AED6F1" />
                  <rect x="38" y="3" width="14" height="8" rx="1" fill="#AED6F1" />
                  <line x1="32" y1="0" x2="38" y2="-8" stroke="#85929E" strokeWidth="1.4" />
                  <line x1="38" y1="-8" x2="44" y2="-8" stroke="#85929E" strokeWidth="1.4" />
                  <motion.circle cx="44" cy="-8" r="2.2" fill="#F4D03F" animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }} transition={{ duration: 0.4, repeat: animationRepeat, repeatDelay: 1.4 }} />
                  {spokedWheel(12, 22, 5, 0.5)}
                  {spokedWheel(46, 22, 5, 0.5)}
                </g>
              ) : (
                <g>
                  <rect x="0" y="0" width="58" height="22" rx="3" fill="#4A5A65" />
                  <rect x="0" y="0" width="14" height="22" rx="3" fill="#2E3B44" />
                  <motion.circle cx="10" cy="11" r="3" fill="#F4D03F" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: animationRepeat, ease: 'easeInOut' }} />
                  <rect x="20" y="3" width="14" height="8" rx="1" fill="#85929E" />
                  <rect x="38" y="3" width="14" height="8" rx="1" fill="#85929E" />
                  <rect x="27" y="-7" width="5" height="7" fill="#2E3B44" />
                  <motion.g
                    animate={{ y: [-7, -18], opacity: [0.6, 0], scale: [1, 1.6] }}
                    transition={{ duration: 1.4, repeat: animationRepeat, ease: 'easeOut' }}
                  >
                    <circle cx="29.5" cy="-7" r="2.5" fill="#BFC9CA" />
                  </motion.g>
                  {spokedWheel(12, 22, 5, 0.6)}
                  {spokedWheel(46, 22, 5, 0.6)}
                </g>
              )}

              {/* Freight wagons — cargo varies with the policy levers */}
              {[...Array(heavyVehiclesLevel >= 3 ? 3 : 2)].map((_, wi) => (
                <motion.g
                  key={wi}
                  animate={{ x: wi % 2 ? [0, -1.4, 0, 1.4, 0] : [0, 1.4, 0, -1.4, 0] }}
                  transition={{ duration: 3 + wi * 0.2, repeat: animationRepeat, ease: 'easeInOut', delay: 0.4 + wi * 0.4 }}
                >
                  <g transform={`translate(${70 + wi * 64}, 0)`}>
                    <rect x="0" y="0" width="56" height="20" rx="2" fill="#7F8C8D" />
                    <rect x="0" y="0" width="56" height="8" rx="2" fill="#95A5A6" />
                    <rect x="2" y="-4" width="52" height="4" rx="1" fill="#5D6D7E" />
                    {cargoStack(freightCargo)}
                    {spokedWheel(12, 22, 4.5, 0.58)}
                    {spokedWheel(44, 22, 4.5, 0.58)}
                  </g>
                </motion.g>
              ))}
            </g>
          </motion.g>

          {/* Rail signals — one per direction, red/green cycling */}
          <g>
            {[{ x: 210, y: -22, side: 1 }, { x: 470, y: -22, side: -1 }, { x: 610, y: 30, side: 1 }].map((sig, i) => (
              <g key={`signal-${i}`} transform={`translate(${sig.x}, ${sig.y})`}>
                {/* Mast */}
                <rect x="-1.5" y="0" width="3" height="26" fill="#34495E" />
                {/* Signal head */}
                <rect x="-6" y="-12" width="12" height="14" rx="2" fill="#2C3E50" />
                {/* Red lamp */}
                <motion.circle
                  cx="0" cy="-8" r="3" fill="#E74C3C"
                  animate={{ opacity: [1, 1, 0.15, 0.15, 1] }}
                  transition={{ duration: 6 + i * 1.5, repeat: animationRepeat, ease: 'linear', delay: i * 2 }}
                />
                {/* Green lamp */}
                <motion.circle
                  cx="0" cy="-2" r="3" fill="#27AE60"
                  animate={{ opacity: [0.15, 0.15, 1, 1, 0.15] }}
                  transition={{ duration: 6 + i * 1.5, repeat: animationRepeat, ease: 'linear', delay: i * 2 }}
                />
                {/* Small cross-arm */}
                <line x1={sig.side * -7} y1="-12" x2={sig.side * 7} y2="-12" stroke="#2C3E50" strokeWidth="2" />
              </g>
            ))}
          </g>

          {/* Level crossing gate where the road meets the railway */}
          <g transform="translate(300, -30)">
            {/* Gate post */}
            <rect x="-2" y="20" width="4" height="36" fill="#5D6D7E" />
            {/* Striped barrier arm — raises when a train approaches */}
            <motion.g
              animate={{ rotate: [0, -85, -85, 0, 0] }}
              transition={{ duration: 16, repeat: animationRepeat, ease: 'easeInOut', times: [0, 0.18, 0.5, 0.68, 1] }}
              style={{ transformOrigin: '0px 20px' }}
            >
              <rect x="-34" y="18.5" width="34" height="3.5" rx="1" fill="#E74C3C" />
              <rect x="-30" y="18.5" width="7" height="3.5" fill="#FDFEFE" />
              <rect x="-19" y="18.5" width="7" height="3.5" fill="#FDFEFE" />
              <rect x="-8" y="18.5" width="7" height="3.5" fill="#FDFEFE" />
            </motion.g>
            {/* Flashing red light on the post */}
            <motion.circle
              cx="0" cy="12" r="3.5" fill="#E74C3C"
              animate={{ opacity: [1, 0.1, 1, 0.1, 1] }}
              transition={{ duration: 1.6, repeat: animationRepeat, ease: 'easeInOut' }}
            />
            {/* Post shadow */}
            <ellipse cx="4" cy="57" rx="8" ry="2" fill="black" opacity="0.15" />
          </g>
        </g>
        
        {/* Power lines with pylons */}
        <g>
          {/* Pylons */}
          <g transform="translate(680, 220)">
            <path d="M0 150 L15 0 L30 150" stroke="#7F8C8D" strokeWidth="3" fill="none" />
            <line x1="-15" y1="40" x2="45" y2="40" stroke="#7F8C8D" strokeWidth="3" />
            <line x1="-10" y1="80" x2="40" y2="80" stroke="#7F8C8D" strokeWidth="3" />
          </g>
          <g transform="translate(780, 200)">
            <path d="M0 170 L15 0 L30 170" stroke="#7F8C8D" strokeWidth="3" fill="none" />
            <line x1="-15" y1="45" x2="45" y2="45" stroke="#7F8C8D" strokeWidth="3" />
            <line x1="-10" y1="90" x2="40" y2="90" stroke="#7F8C8D" strokeWidth="3" />
          </g>
          
          {/* Power lines */}
          <path d="M650 280 L695 260 L795 245 L880 260" stroke="#2C3E50" strokeWidth="2" fill="none" />
          
          {/* Animated energy pulses with glow halo: follow the line at a steady speed. */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <motion.circle
                r="9"
                fill="#F9E79F"
                initial={{ cx: 650, cy: 280, opacity: 0 }}
                animate={{
                  cx: [650, 695, 795, 880],
                  cy: [280, 260, 245, 260],
                  opacity: [0, 0.35, 0.35, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: animationRepeat,
                  times: [0, 0.208, 0.635, 1],
                  ease: "linear",
                  delay: i * 1.05,
                }}
              />
              <motion.circle
                r="4"
                fill="#F4D03F"
                initial={{ cx: 650, cy: 280, opacity: 0 }}
                animate={{
                  cx: [650, 695, 795, 880],
                  cy: [280, 260, 245, 260],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: animationRepeat,
                  times: [0, 0.208, 0.635, 1],
                  ease: "linear",
                  delay: i * 1.05,
                }}
              />
            </g>
          ))}
        </g>
        
        {/* Industrial area */}
        <g transform="translate(820, 300)" filter="url(#subtleDepth)">
          {/* Factory building */}
          <path d="M0 140 L55 110 L55 35 L0 65 Z" fill="#5D6D7E" />
          <path d="M55 110 L110 140 L110 65 L55 35 Z" fill="#34495E" />
          <path d="M0 65 L55 35 L110 65 L55 95 Z" fill="#85929E" />
          
          {/* Smokestacks */}
          <rect x="18" y="-35" width="12" height="65" fill="#5D6D7E" />
          <ellipse cx="24" cy="-35" rx="8" ry="2.5" fill="#34495E" />
          
          <rect x="45" y="-25" width="10" height="55" fill="#5D6D7E" />
          <ellipse cx="50" cy="-25" rx="7" ry="2" fill="#34495E" />
          
          {/* Animated smoke particles */}
          {carbonCaptureLevel < 3 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.g
                  key={i}
                  initial={{ x: i < 3 ? 24 : 50, y: -35, opacity: 0.7 }}
                  animate={{ 
                    y: [-35 - (i % 3) * 12, -90 - (i % 3) * 20],
                    x: [
                      i < 3 ? 24 : 50,
                      (i < 3 ? 24 : 50) + (5 + windLevel * 4) + (i % 2 === 0 ? 10 : -8),
                    ],
                    opacity: [0.7 - i * 0.1, 0],
                    scale: [1, 1.8]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: animationRepeat, 
                    ease: "easeOut",
                    delay: i * 0.6
                  }}
                >
                  <ellipse rx={10 + i * 1.5} ry={5 + i * 0.8} fill="#BFC9CA" opacity={carbonCaptureLevel === 1 ? 0.6 : 0.35} />
                </motion.g>
              ))}
            </>
          )}
          
          {/* Solar panels on roof */}
          {solarLevel >= 2 && (
            <g>
              {[0, 1, 2].map(i => (
                <motion.rect 
                  key={i}
                  x={8 + i * 16} 
                  y={45 - i * 6} 
                  width="12" 
                  height="8" 
                  fill="#2E86AB" 
                  transform={`skewX(-25)`}
                  animate={{ fill: ['#2E86AB', '#5DADE2', '#2E86AB'] }}
                  transition={{ duration: 2.5, repeat: animationRepeat, delay: i * 0.4 }}
                />
              ))}
            </g>
          )}
        </g>
        
        {/* Nuclear power plant */}
        {nuclearLevel >= 2 && (
          <g transform="translate(920, 270)">
            {/* Cooling tower */}
            <path d="M0 100 L35 80 L35 25 L0 45 Z" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="1.5" />
            <path d="M35 80 L70 100 L70 45 L35 25 Z" fill="#D5DBDB" stroke="#BDC3C7" strokeWidth="1.5" />
            <ellipse cx="35" cy="25" rx="22" ry="6" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="1.5" />
            <path d="M12 25 Q35 -15 58 25" fill="none" stroke="#BDC3C7" strokeWidth="2.5" />
            
            {/* Atom symbol */}
            <g transform="translate(35, 65)">
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: animationRepeat, ease: "linear" }}
              >
                <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#E74C3C" strokeWidth="2" />
                <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#E74C3C" strokeWidth="2" transform="rotate(60)" />
                <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#E74C3C" strokeWidth="2" transform="rotate(120)" />
              </motion.g>
              <motion.circle 
                cx="0" cy="0" r="3.5" fill="#E74C3C"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: animationRepeat }}
              />
            </g>
            
            {/* Steam from cooling */}
            {[...Array(4)].map((_, i) => (
              <motion.g
                key={i}
                initial={{ x: 20 + i * 10, y: -25, opacity: 0.4 }}
                animate={{ 
                  y: [-25, -65],
                  opacity: [0.4, 0],
                  scale: [1, 1.6]
                }}
                transition={{ 
                  duration: 3.5, 
                  repeat: animationRepeat, 
                  ease: "easeOut",
                  delay: i * 0.9
                }}
              >
                <ellipse rx="7" ry="3.5" fill="white" />
              </motion.g>
            ))}
          </g>
        )}
        
        {/* Solar farm */}
        {solarPanels > 0 && (
          <g transform="translate(620, 430)">
            {[...Array(solarPanels * 2)].map((_, i) => (
              <motion.g 
                key={i} 
                transform={`translate(${(i % 4) * 28}, ${Math.floor(i / 4) * 18})`}
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2 + (i % 3) * 0.5, repeat: animationRepeat, delay: i * 0.15 }}
              >
                <rect x="0" y="0" width="18" height="10" fill="#1A5276" stroke="#154360" strokeWidth="0.5" />
                <line x1="4.5" y1="0" x2="4.5" y2="10" stroke="#154360" strokeWidth="0.5" />
                <line x1="9" y1="0" x2="9" y2="10" stroke="#154360" strokeWidth="0.5" />
                <line x1="13.5" y1="0" x2="13.5" y2="10" stroke="#154360" strokeWidth="0.5" />
              </motion.g>
            ))}
          </g>
        )}
        
        {/* Forest with swaying trees */}
        <g>
          {[...Array(trees)].map((_, i) => (
            <motion.g 
              key={i} 
              transform={`translate(${980 + (i % 6) * 35 + Math.floor(i / 6) * 18}, ${360 + Math.floor(i / 6) * 25})`}
              animate={{ rotate: [-2.5, 2.5, -2.5] }}
              transition={{ 
                duration: 3 + (i % 3) * 0.6, 
                repeat: animationRepeat, 
                ease: "easeInOut",
                delay: i * 0.15
              }}
              style={{ transformOrigin: 'bottom center' }}
            >
              <polygon points="0,0 -12,35 12,35" fill="#27AE60" />
              <polygon points="0,-18 -10,15 10,15" fill="#2ECC71" />
              <polygon points="0,-32 -7,0 7,0" fill="#58D68D" />
              <rect x="-2.5" y="35" width="5" height="8" fill="#6E2C00" />
            </motion.g>
          ))}
          
          {trees === 0 && (
            <>
              <motion.g 
                transform="translate(1020, 400)"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: animationRepeat, ease: "easeInOut" }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <polygon points="0,0 -10,30 10,30" fill="#229954" />
                <polygon points="0,-12 -8,10 8,10" fill="#27AE60" />
                <rect x="-2" y="30" width="4" height="7" fill="#6E2C00" />
              </motion.g>
              <motion.g 
                transform="translate(1070, 420)"
                animate={{ rotate: [2, -2, 2] }}
                transition={{ duration: 3.5, repeat: animationRepeat, ease: "easeInOut" }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <polygon points="0,0 -9,28 9,28" fill="#229954" />
                <polygon points="0,-10 -7,8 7,8" fill="#27AE60" />
                <rect x="-1.5" y="28" width="3" height="6" fill="#6E2C00" />
              </motion.g>
            </>
          )}
        </g>
        
        {/* Drifting leaves from the forest */}
        {trees > 0 && [...Array(3)].map((_, i) => (
          <motion.g
            key={`leaf-${i}`}
            initial={{ x: 1000 + i * 40, y: 340 + i * 18, opacity: 0 }}
            animate={{
              x: [1000 + i * 40, 985 + i * 40 + (i % 2 ? 16 : -12), 1015 + i * 40, 990 + i * 40],
              y: [340 + i * 18, 405 + i * 18, 480 + i * 18, 555],
              rotate: [0, 120, 240, 360],
              opacity: [0, 0.9, 0.8, 0],
            }}
            transition={{ duration: 11 + i * 3, repeat: animationRepeat, ease: "linear", delay: i * 3 }}
            style={{ transformOrigin: 'center' }}
          >
            <ellipse rx="3.4" ry="1.9" fill="#2ECC71" />
          </motion.g>
        ))}
        
        {/* Farm area */}
        <g transform="translate(40, 450)">
          <ellipse cx="90" cy="70" rx="110" ry="45" fill="#A9DFBF" />
          <ellipse cx="135" cy="50" rx="75" ry="32" fill="#ABEBC6" />
          
          {/* Fence */}
          <g>
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={20 + i * 20} y1="100" x2={20 + i * 20} y2="85" stroke="#D7BDE2" strokeWidth="2" />
            ))}
            <line x1="20" y1="92" x2="240" y2="92" stroke="#D7BDE2" strokeWidth="2" />
            <line x1="20" y1="98" x2="240" y2="98" stroke="#D7BDE2" strokeWidth="2" />
          </g>
          
          {/* Animated cow */}
          <motion.g 
            transform="translate(70, 60)"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 12, repeat: animationRepeat, ease: "easeInOut" }}
          >
            <ellipse cx="0" cy="0" rx="14" ry="9" fill="#FDFEFE" />
            <ellipse cx="4" cy="-4" rx="7" ry="5" fill="#FDFEFE" />
            <circle cx="6" cy="-5" r="1.2" fill="#2C3E50" />
            <rect x="-7" y="5" width="3.5" height="7" fill="#FDFEFE" />
            <rect x="-2" y="5" width="3.5" height="7" fill="#FDFEFE" />
            <rect x="3" y="5" width="3.5" height="7" fill="#FDFEFE" />
            <rect x="8" y="5" width="3.5" height="7" fill="#FDFEFE" />
            <ellipse cx="-4" cy="0" rx="3.5" ry="2.5" fill="#2C3E50" />
            <ellipse cx="7" cy="2" rx="2.5" ry="1.8" fill="#2C3E50" />
            {/* Tail */}
            <motion.path
              d="M-14 -2 Q-18 -5 -16 -10"
              stroke="#FDFEFE"
              strokeWidth="2"
              fill="none"
              animate={{ opacity: [0.55, 1, 0.55], rotate: [-4, 4, -4] }}
              transition={{ duration: 0.9, repeat: animationRepeat, ease: "easeInOut" }}
              style={{ transformOrigin: '-14px -2px' }}
            />
          </motion.g>
          
          {/* Second cow */}
          <motion.g 
            transform="translate(125, 42)"
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 14, repeat: animationRepeat, ease: "easeInOut", delay: 2 }}
          >
            <ellipse cx="0" cy="0" rx="14" ry="9" fill="#A1887F" />
            <ellipse cx="4" cy="-4" rx="7" ry="5" fill="#A1887F" />
            <circle cx="6" cy="-5" r="1.2" fill="#2C3E50" />
            <rect x="-7" y="5" width="3.5" height="7" fill="#A1887F" />
            <rect x="-2" y="5" width="3.5" height="7" fill="#A1887F" />
            <rect x="3" y="5" width="3.5" height="7" fill="#A1887F" />
            <rect x="8" y="5" width="3.5" height="7" fill="#A1887F" />
          </motion.g>
          
          {/* Sheep */}
          <motion.g 
            transform="translate(165, 70)"
            animate={{ y: [0, -2.5, 0] }}
            transition={{ duration: 2, repeat: animationRepeat, ease: "easeInOut" }}
          >
            <circle cx="0" cy="0" r="9" fill="#F8F9F9" />
            <circle cx="7" cy="-4" r="5.5" fill="#F8F9F9" />
            <circle cx="9" cy="-5" r="0.8" fill="#2C3E50" />
            <rect x="-4" y="7" width="2.5" height="5" fill="#F8F9F9" />
            <rect x="0" y="7" width="2.5" height="5" fill="#F8F9F9" />
            <rect x="4" y="7" width="2.5" height="5" fill="#F8F9F9" />
            <rect x="8" y="7" width="2.5" height="5" fill="#F8F9F9" />
          </motion.g>
          
          {/* Farm house */}
          <g transform="translate(185, 25)">
            <path d="M0 28 L22 14 L44 28 L44 52 L0 52 Z" fill="#F5B7B1" />
            <path d="M0 28 L22 14 L44 28 L22 42 Z" fill="#E74C3C" />
            <rect x="16" y="36" width="12" height="16" fill="#935116" />
            <rect x="18" y="38" width="3.5" height="5.5" fill="#FEF9E7" />
            <rect x="22.5" y="38" width="3.5" height="5.5" fill="#FEF9E7" />
            <rect x="18" y="45" width="3.5" height="5.5" fill="#FEF9E7" />
            <rect x="22.5" y="45" width="3.5" height="5.5" fill="#FEF9E7" />
            
            {/* Chimney smoke */}
            <motion.g
              initial={{ x: 32, y: 8, opacity: 0.5 }}
              animate={{ y: [8, -25], opacity: [0.5, 0], scale: [1, 1.4] }}
              transition={{ duration: 3, repeat: animationRepeat, ease: "easeOut" }}
            >
              <circle r="4.5" fill="white" />
            </motion.g>
          </g>
        </g>
        
        {/* Wave/Tidal */}
        {waveTidalLevel >= 2 && (
          <g transform="translate(820, 540)">
            {[0, 1, 2].map(i => (
              <motion.path 
                key={i}
                d={`M${i * 18} ${18 + i * 4} Q${9 + i * 18} ${8 + i * 4} ${18 + i * 18} ${18 + i * 4} Q${27 + i * 18} ${28 + i * 4} ${36 + i * 18} ${18 + i * 4}`}
                stroke="#1A5276"
                strokeWidth="2.5"
                fill="none"
                animate={{ opacity: [0.45, 1, 0.45], y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: animationRepeat, ease: "easeInOut", delay: i * 0.25 }}
              />
            ))}
            
            {/* Tidal turbine */}
            <motion.g transform="translate(55, 0)">
              <motion.circle 
                r="14" 
                fill="none" 
                stroke="#154360" 
                strokeWidth="2"
                strokeDasharray="8 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: animationRepeat, ease: "linear" }}
              />
              <circle r="4" fill="#154360" />
            </motion.g>
          </g>
        )}
        
        {/* Bioenergy crops */}
        {levels[14] >= 2 && (
          <g transform="translate(330, 510)">
            {[...Array(12)].map((_, i) => (
              <motion.g 
                key={i} 
                transform={`translate(${i * 10}, ${Math.sin(i) * 2.5})`}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ 
                  duration: 2 + (i % 3) * 0.4, 
                  repeat: animationRepeat, 
                  ease: "easeInOut",
                  delay: i * 0.12
                }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <line x1="0" y1="18" x2="0" y2="0" stroke="#7DCEA0" strokeWidth="1.8" />
                <ellipse cx="0" cy="4" rx="2.5" ry="5" fill="#82E0AA" />
                <ellipse cx="0" cy="10" rx="2.5" ry="5" fill="#ABEBC6" />
              </motion.g>
            ))}
          </g>
        )}
        {/* A subtle shared lighting layer makes objects feel part of one environment. */}
        <rect x="0" y="0" width="1200" height="700" fill="url(#atmosphereOverlay)" pointerEvents="none" />
        </svg>
      </div>
    </MotionConfig>
  );
};
