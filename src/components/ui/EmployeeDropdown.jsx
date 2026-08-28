import DropdownTrigger from './DropdownTrigger';
import DropdownListItem from './DropdownListItem';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'relative',
  dropdownMenu: 'absolute z-20 w-full border rounded-xl mt-1 shadow-lg overflow-hidden',
  list: 'overflow-y-auto',
};

function EmployeeDropdown({wrapperRef, triggerRef, open, onToggle, employees, selectedId, onSelect}) {
  const selectedEmployee = employees.find((employee) => String(employee.id_usuario) === String(selectedId));
  let label = 'Todos los empleados';
  if (selectedEmployee) {
    label = `${selectedEmployee.nombre} ${selectedEmployee.apellido_paterno}`;
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue={!!selectedEmployee} label={label} />
      {open && (
        <div className={styles.dropdownMenu} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
          <div className={styles.list} style={{maxHeight: `${5 * 44}px`}}>
            <DropdownListItem label="Todos los empleados" selected={!selectedId} onClick={() => onSelect('')} />
            {employees.map((employee) => (
              <DropdownListItem key={employee.id_usuario} label={`${employee.nombre} ${employee.apellido_paterno}`}
                selected={String(selectedId) === String(employee.id_usuario)} onClick={() => onSelect(employee.id_usuario)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDropdown;