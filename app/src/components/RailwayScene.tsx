import { motion } from 'framer-motion';
import type { FreightCargoId } from '@/data/calculations';

type RailPower = 'diesel' | 'electric' | 'hydrogen';

interface RailwaySceneProps {
  heavyVehiclesLevel: number;
  freightCargo: FreightCargoId;
  animationRepeat: number;
}

const Wheel = ({ x, y, radius = 5 }: { x: number; y: number; radius?: number }) => (
  <g>
    <circle cx={x} cy={y} r={radius + 1.3} fill="#182c34" />
    <circle cx={x} cy={y} r={radius} fill="#273842" stroke="#a9bbc0" strokeWidth=".85" />
    <circle cx={x} cy={y} r={radius * .46} fill="#7c919a" />
    <circle cx={x} cy={y} r="1" fill="#dce8e9" />
  </g>
);

const Locomotive = ({ power }: { power: RailPower }) => {
  const diesel = power === 'diesel';
  const hydrogen = power === 'hydrogen';
  const body = diesel ? '#344957' : hydrogen ? '#0a806f' : '#145d91';
  const dark = diesel ? '#233843' : hydrogen ? '#065a52' : '#124467';
  const accent = diesel ? '#e6ae62' : hydrogen ? '#83e9b5' : '#a6dff7';

  return (
    <g>
      <ellipse cx="59" cy="-6" rx="58" ry="5.2" fill="#122a35" opacity=".27" />
      <path d="M3 -37 Q5 -47 20 -48 H94 Q106 -47 112 -37 V-15 L106 -10 H8 L2 -17 Z"
        fill={body} stroke={dark} strokeWidth="1.4" />
      <path d="M3 -36 Q5 -45 20 -46 H94 Q105 -45 111 -36 H3 Z"
        fill="#cfe7ed" opacity=".28" />
      <path d="M6 -35 Q8 -43 21 -43 H28 V-26 H7 Z" fill="#c0e5ee" stroke="#1d4055" strokeWidth="1.4" />
      <path d="M33 -40 H60 V-28 H33 Z M65 -40 H88 V-28 H65 Z"
        fill="#b4dce8" stroke="#193f54" strokeWidth="1.2" />
      <path d="M7 -21 H105 V-16 H7 Z" fill={accent} />
      <path d="M9 -15 H106 V-12 H9 Z" fill={dark} />
      <rect x="20" y="-10" width="74" height="4" rx="1" fill="#283b43" />
      <path d="M19 -7 H35 M82 -7 H99" stroke="#a1b2b8" strokeWidth="2" />
      {[21, 29, 37, 45].map(x => <path key={x} d={`M${x} -25 V-18`} stroke={dark} strokeWidth="1" opacity=".6" />)}
      <circle cx="7.5" cy="-21" r="3.2" fill="#fce8a2" stroke="#f8d47c" strokeWidth="1" />
      <circle cx="103" cy="-21" r="2.5" fill="#f4b35e" opacity=".86" />
      {!diesel && !hydrogen && (
        <g stroke="#4a616a" strokeWidth="1.8" fill="none">
          <path d="M43 -47 L51 -59 L60 -47 M51 -59 H65 L72 -47" />
          <path d="M48 -59 H66" strokeWidth="2.5" />
        </g>
      )}
      {diesel && (
        <g>
          <rect x="72" y="-52" width="6" height="5" fill="#263a44" />
          <path d="M68 -36 H94" stroke="#9babb0" strokeWidth="1.4" strokeDasharray="3 2" />
        </g>
      )}
      {hydrogen && (
        <g>
          <text x="77" y="-31" fontSize="11" fontWeight="800" fill="#e6fff2" textAnchor="middle">H₂</text>
          <circle cx="91" cy="-31" r="4" stroke="#d4fff0" strokeWidth="1" fill="none" />
        </g>
      )}
      <rect x="10" y="-11" width="36" height="5" rx="2" fill="#233039" />
      <rect x="67" y="-11" width="36" height="5" rx="2" fill="#233039" />
      <Wheel x={23} y={-7} radius={5.4} />
      <Wheel x={39} y={-7} radius={5.4} />
      <Wheel x={76} y={-7} radius={5.4} />
      <Wheel x={94} y={-7} radius={5.4} />
    </g>
  );
};

const PassengerCoach = ({ index }: { index: number }) => (
  <g transform={`translate(${124 + index * 110} 0)`}>
    <ellipse cx="49" cy="-6" rx="50" ry="4" fill="#102d36" opacity=".2" />
    <path d="M2 -41 Q4 -46 12 -46 H94 Q101 -45 102 -40 V-13 H1 Z"
      fill={index % 2 ? '#dcebf0' : '#ecf4f4'} stroke="#6f929f" strokeWidth="1.1" />
    <path d="M2 -40 Q4 -45 12 -45 H94 Q100 -45 102 -40" stroke="#ffffff" strokeWidth="2" fill="none" />
    <path d="M2 -21 H101 V-17 H2 Z" fill="#0d7196" />
    <path d="M2 -15 H101 V-12 H2 Z" fill="#80b7c6" />
    {[9,27,45,63,81].map(x => (
      <g key={x}>
        <rect x={x} y="-38" width="15" height="12" rx="2" fill="#56889c" stroke="#d1edf4" strokeWidth=".8" />
        <path d={`M${x + 1} -37 L${x + 7} -37 L${x + 1} -29 Z`} fill="#e7fbff" opacity=".35" />
      </g>
    ))}
    <path d="M99 -40 V-12" stroke="#3b5b6b" strokeWidth="2" />
    <rect x="12" y="-10" width="80" height="4" fill="#35444b" rx="1.5" />
    <Wheel x={18} y={-7} />
    <Wheel x={40} y={-7} />
    <Wheel x={69} y={-7} />
    <Wheel x={90} y={-7} />
    <path d="M104 -11 H120" stroke="#3f515a" strokeWidth="3" />
  </g>
);

const Cargo = ({ kind }: { kind: FreightCargoId }) => {
  if (kind === 'hydrogen') {
    return (
      <g>
        {[0,1].map(i => (
          <g key={i} transform={`translate(${i * 37} 0)`}>
            <rect x="7" y="-52" width="32" height="16" rx="8" fill="#c5e5e9" stroke="#709aa7" strokeWidth="1.1" />
            <path d="M14 -50 H33" stroke="#f5ffff" strokeOpacity=".7" />
            <text x="24" y="-41" fontSize="7.5" fontWeight="800" fill="#235d73" textAnchor="middle">H₂</text>
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'timber') {
    return (
      <g>
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x={6+i*18} y={-49+(i%2)*3} width="25" height="10" rx="5" fill="#85614b" stroke="#4d392f" strokeWidth="1" />
            <ellipse cx={30+i*18} cy={-44+(i%2)*3} rx="4.5" ry="4.5" fill="#a98160" stroke="#654c38" />
            <circle cx={30+i*18} cy={-44+(i%2)*3} r="2" fill="none" stroke="#60432e" strokeWidth=".8" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'biomass') {
    return (
      <g>
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={8+i*25} y="-50" width="23" height="14" rx="3" fill="#c3ae76" stroke="#8e7d50" strokeWidth="1" />
            <path d={`M${18+i*25} -50 V-36`} stroke="#eaddaa" strokeWidth="1.5" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'coal') {
    return (
      <g>
        <path d="M5 -36 L9 -51 L22 -48 L35 -55 L46 -48 L60 -52 L77 -44 L79 -36 Z"
          fill="#303942" stroke="#1c2930" strokeWidth="1.5" />
        <path d="M12 -46 L25 -46 M44 -48 L60 -45" stroke="#78838a" strokeWidth="1.2" />
      </g>
    );
  }
  return (
    <g>
      {[
        { x:7, y:-55, w:25, c:'#d98543' },
        { x:35, y:-48, w:19, c:'#457eaf' },
        { x:57, y:-55, w:21, c:'#bca447' },
      ].map((box,i) => (
        <g key={i}>
          <rect x={box.x} y={box.y} width={box.w} height={19} rx="1.5" fill={box.c} stroke="#455665" strokeWidth="1" />
          {Array.from({length:3},(_,j) => (
            <line key={j} x1={box.x+4+j*5} x2={box.x+4+j*5} y1={box.y+2} y2={box.y+17}
              stroke="#233a44" strokeOpacity=".25" />
          ))}
        </g>
      ))}
    </g>
  );
};

const FreightWagon = ({ kind, index }: { kind: FreightCargoId; index: number }) => (
  <g transform={`translate(${125 + index * 105} 0)`}>
    <ellipse cx="45" cy="-6" rx="49" ry="4.5" fill="#102b33" opacity=".2" />
    <path d="M1 -35 H92 L89 -16 H5 Z" fill="#526a75" stroke="#2e4857" strokeWidth="1.5" />
    <rect x="1" y="-35" width="92" height="5" rx="1" fill="#92a5a9" />
    <Cargo kind={kind} />
    <path d="M5 -16 H90" stroke="#a1b4ba" strokeWidth="2" />
    <rect x="6" y="-12" width="78" height="5" rx="2" fill="#2a3d47" />
    <Wheel x={16} y={-7} />
    <Wheel x={36} y={-7} />
    <Wheel x={62} y={-7} />
    <Wheel x={83} y={-7} />
    <path d="M96 -12 H111" stroke="#354b55" strokeWidth="2.8" />
  </g>
);

/**
 * A dedicated foreground railway. Both trains remain visible at every
 * animation frame; the short shunting motion never fades the rolling stock.
 * Heavy Vehicles selects diesel/electric/hydrogen livery and carriage count.
 * Freight cargo follows the other lever policies.
 */
export const RailwayScene = ({ heavyVehiclesLevel, freightCargo, animationRepeat }: RailwaySceneProps) => {
  const passengerPower: RailPower = heavyVehiclesLevel >= 2 ? 'electric' : 'diesel';
  const freightPower: RailPower = heavyVehiclesLevel >= 4 ? 'hydrogen'
    : heavyVehiclesLevel >= 2 ? 'electric' : 'diesel';
  return (
    <g transform="translate(35 540)" aria-label="Two-track railway with passenger and freight trains">
      {/* Ballast and embankment: distinct shoulders, textured gravel and sleepers. */}
      <path d="M-20 -15 H1040 L1080 126 H-50 Z" fill="#415b62" opacity=".27" />
      <path d="M-20 1 L1015 -2 L1070 120 H-45 Z" fill="#777a73" stroke="#c5c2ae" strokeWidth="2" />
      <path d="M-17 8 H1020 L1054 110 H-37 Z" fill="#656e6a" />
      {Array.from({ length: 90 }, (_,i) => (
        <path key={i} d={`M${(i*47)%1040} ${14+(i*37)%96} l${2+i%3} 1 l-3 2 Z`}
          fill={i%3===0 ? '#d3cdc0' : '#293e43'} opacity={i%3===0 ? .35 : .23} />
      ))}
      {/* Rear and front tracks: each contains two rails and spaced sleepers. */}
      {[0, 63].map((offset,track) => (
        <g key={track} transform={`translate(0 ${offset})`}>
          {Array.from({ length: 48 }, (_,i) => (
            <g key={i} transform={`translate(${i*22} 0)`}>
              <rect x="0" y="12" width="10" height="44" rx="1.3" fill="#584b42" />
              <rect x="1" y="12" width="2" height="44" fill="#a28f7c" opacity=".52" />
              <path d="M2 16 H8 M2 52 H8" stroke="#252f33" strokeOpacity=".4" />
            </g>
          ))}
          {[22,43].map((y,i) => (
            <g key={i}>
              <rect x="-8" y={y} width="1060" height="5" rx="1" fill="#293e47" />
              <rect x="-8" y={y} width="1060" height="1.4" fill="#d2e0df" />
              <line x1="-8" x2="1052" y1={y+5} y2={y+5} stroke="#a0a6a1" strokeOpacity=".6" />
            </g>
          ))}
        </g>
      ))}
      {/* Rear passenger service - clearly visible even in the first frame. */}
      <motion.g
        initial={false}
        animate={{ x: [0, 80, 180, 280, 180, 80, 0] }}
        transition={{ duration: 44, repeat: animationRepeat, ease: 'easeInOut' }}
      >
        <g transform="translate(65 40) scale(1.13)">
          <Locomotive power={passengerPower} />
          {Array.from({ length: heavyVehiclesLevel >= 3 ? 3 : 2 }, (_,i) => (
            <PassengerCoach key={i} index={i} />
          ))}
        </g>
      </motion.g>
      {/* Foreground freight, with dynamically selected cargo and cleaner fleets. */}
      <motion.g
        initial={false}
        animate={{ x: [0, 65, 145, 225, 145, 65, 0] }}
        transition={{ duration: 51, repeat: animationRepeat, ease: 'easeInOut', delay: -10 }}
      >
        <g transform="translate(105 101) scale(1.17)">
          <Locomotive power={freightPower} />
          {Array.from({ length: heavyVehiclesLevel >= 3 ? 3 : 2 }, (_,i) => (
            <FreightWagon key={i} kind={freightCargo} index={i} />
          ))}
        </g>
      </motion.g>
      {/* Signals and a controlled level-crossing barrier. */}
      {[{x:245,y:-8},{x:818,y:55}].map((signal,i) => (
        <g key={i} transform={`translate(${signal.x} ${signal.y})`}>
          <ellipse cx="3" cy="70" rx="12" ry="3" fill="#20353c" opacity=".27" />
          <rect x="-2" y="0" width="4" height="69" rx="1" fill="#7c9398" />
          <rect x="-8" y="-8" width="16" height="28" rx="3" fill="#213a43" stroke="#9fb3bc" />
          <motion.circle cx="0" cy="0" r="4" fill="#f16a5b"
            animate={{ opacity:[.95,.25,.25,.95] }}
            transition={{ duration:8, repeat:animationRepeat, delay:i*3 }} />
          <motion.circle cx="0" cy="12" r="4" fill="#58c899"
            animate={{ opacity:[.2,.2,.95,.2] }}
            transition={{ duration:8, repeat:animationRepeat, delay:i*3 }} />
        </g>
      ))}
      <g transform="translate(340 -8)">
        <rect x="-3" y="13" width="7" height="60" fill="#86979a" />
        <rect x="-8" y="10" width="16" height="7" fill="#5d737d" rx="2" />
        <motion.g
          animate={{ rotate:[0,-80,-80,0,0] }}
          transition={{ duration:20, repeat:animationRepeat, times:[0,.2,.57,.75,1], ease:'easeInOut' }}
          style={{ transformOrigin:'0px 14px' }}
        >
          <rect x="-45" y="12" width="46" height="5" rx="2" fill="#f5f3eb" />
          {[0,1,2,3].map(i => (
            <rect key={i} x={-43+i*11} y="12" width="5" height="5" fill="#e95751" />
          ))}
        </motion.g>
        <circle cx="0" cy="8" r="4" fill="#f46856" />
      </g>
    </g>
  );
};
