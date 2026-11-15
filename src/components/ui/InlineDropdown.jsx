import {motion, AnimatePresence} from 'framer-motion';
import DropdownTrigger from './DropdownTrigger';
import DropdownListItem from './DropdownListItem';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'flex flex-col gap-1 relative flex-1 min-w-[180px]',
  dropdown: 'absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden',
  list: 'overflow-y-auto',
};

const dropdownVariants = {
  hidden: {opacity: 0, y: -4, scaleY: 0.97},
  visible: {opacity: 1, y: 0, scaleY: 1},
};

function InlineDropdown({wrapperRef, triggerRef, open, listHeight = 224, onToggle, label, options, selectedValue, onSelect, hasValue = true, error, icon, asField = false}) {
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue={hasValue} label={label} error={error} icon={icon} asField={asField} />
      <AnimatePresence>
        {open && (
          <motion.div className={styles.dropdown}
            style={{
              borderColor: COLORS.dataFields,
              backgroundColor: COLORS.background,
              transformOrigin: 'top',
              top: '100%',
              marginTop: '2px',
            }}
            variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{duration: 0.16, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.list} style={{maxHeight: listHeight}}>
              {options.map((option) => (
                <DropdownListItem key={option.value} label={option.label} selected={selectedValue === option.value}
                  onClick={() => onSelect(option.value)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InlineDropdown;