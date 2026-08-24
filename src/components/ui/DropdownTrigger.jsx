import {ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  button: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
};

function DropdownTrigger({triggerRef, label, open, onClick, error, hasValue}) {
  return (
    <button ref={triggerRef} type="button" className={styles.button} onClick={onClick}
      style={{borderColor: error ? '#f87171' : COLORS.dataFields, backgroundColor: COLORS.background, color: hasValue ? COLORS.text : COLORS.labels}}>
      <span className="truncate">{label}</span>
      {open ? <ChevronUp size={16} style={{color: COLORS.labels, flexShrink: 0}} /> : <ChevronDown size={16} style={{color: COLORS.labels, flexShrink: 0}} />}
    </button>
  );
}

export default DropdownTrigger;