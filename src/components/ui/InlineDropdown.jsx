import DropdownTrigger from './DropdownTrigger';
import DropdownListItem from './DropdownListItem';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'flex flex-col gap-1 relative flex-1 min-w-[180px]',
  dropdown: 'absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden',
  list: 'max-h-56 overflow-y-auto',
};

function InlineDropdown({wrapperRef, triggerRef, open, opensUpward, onToggle, label, options, selectedValue, onSelect}) {
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue label={label} />
      {open && (
        <div className={styles.dropdown} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background,
          bottom: opensUpward ? '100%' : 'auto', top: opensUpward ? 'auto' : '100%', marginBottom: opensUpward ? '4px' : '0', marginTop: opensUpward ? '0' : '4px'}}>
          <div className={styles.list}>
            {options.map((option) => (
              <DropdownListItem key={option.value} label={option.label} selected={selectedValue === option.value}
                onClick={() => onSelect(option.value)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InlineDropdown;