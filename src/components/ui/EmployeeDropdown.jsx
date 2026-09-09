import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Search} from 'lucide-react';
import DropdownTrigger from './DropdownTrigger';
import DropdownListItem from './DropdownListItem';
import {COLORS} from '../../constants';

const styles = {
  wrapper: 'relative',
  dropdownMenu: 'absolute z-20 w-full border rounded-xl mt-1 shadow-lg overflow-hidden',
  searchWrapper: 'flex items-center gap-2 px-3 py-2 border-b',
  searchInput: 'flex-1 text-sm font-inter outline-none bg-transparent',
  list: 'overflow-y-auto',
  emptyText: 'text-xs font-inter text-center py-3',
};

const dropdownVariants = {
  hidden: {opacity: 0, y: -8, scaleY: 0.95},
  visible: {opacity: 1, y: 0, scaleY: 1},
};

function EmployeeDropdown({wrapperRef, triggerRef, open, onToggle, employees, selectedId, onSelect}) {
  const [query, setQuery] = useState('');
  const selectedEmployee = employees.find((employee) => String(employee.id_usuario) === String(selectedId));
  let label = 'Todos los empleados';
  if (selectedEmployee) {
    label = `${selectedEmployee.nombre} ${selectedEmployee.apellido_paterno}`;
  }
  const normalizedQuery = query.trim().toLowerCase();
  const filteredEmployees = normalizedQuery
    ? employees.filter((employee) => `${employee.nombre} ${employee.apellido_paterno}`.toLowerCase().includes(normalizedQuery))
    : employees;
  const handleSelect = (id) => {
    setQuery('');
    onSelect(id);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={onToggle} hasValue={!!selectedEmployee} label={label} />
      <AnimatePresence>
        {open && (
          <motion.div className={styles.dropdownMenu} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, transformOrigin: 'top'}}
            variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.16, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.searchWrapper} style={{borderColor: COLORS.dataFields}}>
              <Search size={14} style={{color: COLORS.labels}} />
              <input className={styles.searchInput} style={{color: COLORS.text}} placeholder="Buscar empleado..."
                value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            </div>
            <div className={styles.list} style={{maxHeight: `${5 * 44}px`}}>
              {!normalizedQuery && <DropdownListItem label="Todos los empleados" selected={!selectedId} onClick={() => handleSelect('')} />}
              {filteredEmployees.length === 0 ? (
                <p className={styles.emptyText} style={{color: COLORS.labels}}>Sin resultados</p>
              ) : (
                filteredEmployees.map((employee) => (
                  <DropdownListItem key={employee.id_usuario} label={`${employee.nombre} ${employee.apellido_paterno}`}
                    selected={String(selectedId) === String(employee.id_usuario)} onClick={() => handleSelect(employee.id_usuario)} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmployeeDropdown;