import {motion} from 'framer-motion';
import {COLORS} from '../../constants';

function HardHatMascot({size = 88, waving = true}) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Casquito, la mascota del sistema">
      <ellipse cx="60" cy="112" rx="30" ry="5" fill={COLORS.shadowSoft} />
      <rect x="44" y="92" width="8" height="16" rx="4" fill={COLORS.title} />
      <rect x="68" y="92" width="8" height="16" rx="4" fill={COLORS.title} />
      <ellipse cx="46" cy="108" rx="8" ry="4" fill={COLORS.text} />
      <ellipse cx="74" cy="108" rx="8" ry="4" fill={COLORS.text} />
      <path d="M22 74 Q12 80 14 90" stroke={COLORS.title} strokeWidth="7" strokeLinecap="round" fill="none" />
      <motion.g style={{originX: '98px', originY: '72px'}}
        animate={waving ? {rotate: [0, -28, 0, -28, 0]} : {rotate: 0}}
        transition={{duration: 1.4, repeat: waving ? Infinity : 0, repeatDelay: 0.6}}>
        <path d="M98 72 Q110 62 108 50" stroke={COLORS.title} strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="108" cy="48" r="6" fill={COLORS.background} stroke={COLORS.title} strokeWidth="3" />
      </motion.g>
      <path d="M12 82 Q60 96 108 82 Q110 90 100 92 Q60 102 20 92 Q10 90 12 82 Z" fill={COLORS.title} />
      <path d="M20 84 Q18 30 60 26 Q102 30 100 84 Z" fill={COLORS.primary} />
      <path d="M52 27 Q60 24 68 27 L66 84 L54 84 Z" fill={COLORS.mascotRed} />
      <path d="M21 72 Q60 80 99 72 L99 79 Q60 87 21 79 Z" fill={COLORS.background} />
      <path d="M32 44 Q36 34 46 31" stroke={COLORS.onColorText55} strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="45" cy="56" rx="6" ry="7.5" fill={COLORS.background} />
      <ellipse cx="75" cy="56" rx="6" ry="7.5" fill={COLORS.background} />
      <motion.g animate={{scaleY: [1, 1, 0.1, 1]}} transition={{duration: 3.2, repeat: Infinity, times: [0, 0.9, 0.95, 1]}}
        style={{originY: '56px'}}>
        <circle cx="46" cy="57" r="3.6" fill={COLORS.text} />
        <circle cx="76" cy="57" r="3.6" fill={COLORS.text} />
        <circle cx="47.3" cy="55.5" r="1.2" fill={COLORS.background} />
        <circle cx="77.3" cy="55.5" r="1.2" fill={COLORS.background} />
      </motion.g>
      <ellipse cx="36" cy="66" rx="5" ry="3" fill={COLORS.mascotBlush} />
      <ellipse cx="84" cy="66" rx="5" ry="3" fill={COLORS.mascotBlush} />
      <path d="M50 65 Q60 74 70 65" stroke={COLORS.background} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default HardHatMascot;
