import {COLORS} from '../../constants';

function FVIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill={COLORS.primary} />
      <path d="M10 16L14 20L22 12" stroke={COLORS.background} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default FVIcon;