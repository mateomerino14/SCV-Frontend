import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import DropdownTrigger from '../../../components/ui/DropdownTrigger';
import DropdownListItem from '../../../components/ui/DropdownListItem';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'relative',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
};

const dropdownVariants = {
  hidden: {opacity: 0, y: -6, scaleY: 0.96},
  visible: {opacity: 1, y: 0, scaleY: 1},
};

function RoleSelector({roleOptions, selectedRole, open, menuPosition, triggerRef, menuRef, onToggle, onSelect}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Rol de Sistema</p>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue={!!selectedRole}
        label={selectedRole?.label || 'Seleccionar rol'} />
      {createPortal(
        <AnimatePresence>
          {open && menuPosition && (
            <motion.div ref={menuRef} className={styles.dropdownMenu}
              style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, left: menuPosition.left,
                width: menuPosition.width, top: menuPosition.top, bottom: menuPosition.bottom, transformOrigin: 'top'}}
              variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{duration: 0.16, ease: [0.22, 1, 0.36, 1]}}>
              {roleOptions.map((role) => (
                <DropdownListItem key={role.value} label={role.label} selected={selectedRole?.value === role.value}
                  onClick={() => onSelect(role)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default RoleSelector;