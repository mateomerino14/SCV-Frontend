import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl border',
  header: 'flex items-center justify-between gap-3 p-4',
  headerLeft: 'flex items-center gap-2.5 flex-1 min-w-0 bg-transparent border-none p-0 text-left',
  iconBox: 'w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0',
  label: 'text-[15px] font-bold font-inter',
  toggle: 'w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 border-none p-0',
  toggleCircle: 'absolute top-1 w-4 h-4 rounded-full transition-all',
  body: 'px-4 pb-4 flex flex-col gap-3',
};

function ToggleSection({active, onToggleActive, expanded = true, onToggleExpanded, icon: Icon, label, disabled, children}) {
  const canCollapse = active && !!onToggleExpanded;
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.header}>
        <button type="button" className={styles.headerLeft} style={{cursor: canCollapse ? 'pointer' : 'default'}} onClick={() => canCollapse && onToggleExpanded()}>
          <span className={styles.iconBox} style={{backgroundColor: COLORS.primarySoft}}>
            <Icon size={16} style={{color: COLORS.primary}} />
          </span>
          <span className={styles.label} style={{color: COLORS.text}}>{label}</span>
        </button>
        <button type="button" className={styles.toggle} role="switch" aria-checked={active} aria-label={label} disabled={disabled}
          style={{backgroundColor: active ? COLORS.primary : COLORS.dataFields, opacity: disabled ? 0.6 : 1}} onClick={() => !disabled && onToggleActive()}>
          <span className={styles.toggleCircle} style={{left: active ? '28px' : '4px', backgroundColor: COLORS.background}} />
        </button>
      </div>
      {active && expanded && <div className={styles.body}>{children}</div>}
    </div>
  );
}

export default ToggleSection;
