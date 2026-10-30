import {ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  button: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
  fieldButton: 'w-full border rounded-xl px-4 py-3 gap-2 text-sm font-inter flex items-center justify-between cursor-pointer text-left',
  labelGroup: 'flex items-center gap-2 min-w-0',
};

function DropdownTrigger({triggerRef, label, open, onClick, error, hasValue, icon, asField = false}) {
  return (
    <button ref={triggerRef} type="button" className={asField ? styles.fieldButton : styles.button} onClick={onClick}
      style={{borderColor: error ? COLORS.fieldErrorBorder : COLORS.dataFields, backgroundColor: COLORS.background, color: hasValue ? COLORS.text : COLORS.labels}}>
      <span className={styles.labelGroup}>
        {icon && <span className="flex shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </span>
      {open ? <ChevronUp size={16} style={{color: COLORS.labels, flexShrink: 0}} /> : <ChevronDown size={16} style={{color: COLORS.labels, flexShrink: 0}} />}
    </button>
  );
}

export default DropdownTrigger;