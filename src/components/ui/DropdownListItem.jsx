import {Check} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  item: 'flex items-center justify-between px-3 py-2.5 text-sm font-inter cursor-pointer',
};

function DropdownListItem({label, selected, onClick}) {
  return (
    <div className={styles.item} onClick={onClick}
      style={{backgroundColor: selected ? COLORS.backgroundHeader : 'transparent', color: selected ? COLORS.primary : COLORS.text, borderTop: `1px solid ${COLORS.dataFields}`}}>
      <span>{label}</span>
      {selected && <Check size={14} style={{color: COLORS.primary}} />}
    </div>
  );
}

export default DropdownListItem;