import {motion, AnimatePresence} from 'framer-motion';
import DropdownTrigger from './DropdownTrigger';
import DropdownListItem from './DropdownListItem';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'flex flex-col gap-1 relative flex-1 min-w-[180px]',
  dropdown: 'absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden',
  list: 'max-h-56 overflow-y-auto',
};

const dropdownVariants = {
  hidden: {opacity: 0, y: -4, scaleY: 0.97},
  visible: {opacity: 1, y: 0, scaleY: 1},
};

function InlineDropdown({wrapperRef, triggerRef, open, opensUpward, onToggle, label, options, selectedValue, onSelect}) {
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue label={label} />
      <AnimatePresence>
        {open && (
          <motion.div className={styles.dropdown}
            style={{
              borderColor: COLORS.dataFields,
              backgroundColor: COLORS.background,
              transformOrigin: opensUpward ? 'bottom' : 'top',
              bottom: opensUpward ? '100%' : 'auto',
              top: opensUpward ? 'auto' : '100%',
              marginBottom: opensUpward ? '2px' : '0',
              marginTop: opensUpward ? '0' : '2px',
            }}
            variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{duration: 0.16, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.list}>
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