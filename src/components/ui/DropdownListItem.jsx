import {Check} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  item: 'flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-inter cursor-pointer',
  description: 'text-[11px] leading-snug',
};

function DropdownListItem({label, description, selected, onClick}) {
  return (
    <div className={styles.item} onClick={onClick}
      style={{backgroundColor: selected ? COLORS.backgroundHeader : 'transparent', color: selected ? COLORS.primary : COLORS.text, borderTop: `1px solid ${COLORS.dataFields}`}}>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span>{label}</span>
        {description && <span className={styles.description} style={{color: COLORS.labels}}>{description}</span>}
      </span>
      {selected && <Check size={14} className="shrink-0" style={{color: COLORS.primary}} />}
    </div>
  );
}

export default DropdownListItem;