import {createPortal} from 'react-dom';
import DropdownTrigger from '../../../components/ui/DropdownTrigger';
import DropdownListItem from '../../../components/ui/DropdownListItem';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'relative',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
};

function RoleSelector({roleOptions, selectedRole, open, menuPosition, triggerRef, menuRef, onToggle, onSelect}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Rol de Sistema</p>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue={!!selectedRole}
        label={selectedRole?.label || 'Seleccionar rol'} />
      {open && menuPosition && createPortal(
        <div ref={menuRef} className={styles.dropdownMenu}
          style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, left: menuPosition.left,
          width: menuPosition.width, top: menuPosition.top, bottom: menuPosition.bottom}}>
          {roleOptions.map((role) => (
            <DropdownListItem key={role.value} label={role.label} selected={selectedRole?.value === role.value}
              onClick={() => onSelect(role)} />
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export default RoleSelector;