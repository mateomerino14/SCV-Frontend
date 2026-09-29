import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import DropdownTrigger from '../../../components/ui/DropdownTrigger';
import DropdownSearchInput from '../../../components/ui/DropdownSearchInput';
import DropdownListItem from '../../../components/ui/DropdownListItem';
import {COLORS} from '../../../constants';
import useSearchableSelector from '../hooks/useSearchableSelector';

const styles = {
  wrapper: 'relative',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
  list: 'max-h-52 overflow-y-auto',
  empty: 'px-4 py-3 text-sm font-inter text-center',
  fieldError: 'text-xs font-inter mt-1',
};

const dropdownVariants = {
  hidden: {opacity: 0, y: -6, scaleY: 0.96},
  visible: {opacity: 1, y: 0, scaleY: 1},
};

// Selector con buscador: se escribe para filtrar en vez de recorrer toda la lista.
// emptyOption ({value, label}) agrega una opcion "sin asignar" arriba de la lista.
function SearchableSelector({label, options, value, onChange, placeholder, searchPlaceholder, emptyOption, error}) {
  const allOptions = emptyOption ? [emptyOption, ...options] : options;
  const {
    open, search, setSearch, menuPosition, wrapperRef, triggerRef, menuRef, inputRef, selectedOption,
    filteredOptions, handleToggle, handleSelect,
  } = useSearchableSelector(allOptions, value, onChange);
  const hasValue = !!selectedOption && selectedOption !== emptyOption && selectedOption.value !== '';
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={handleToggle} error={error}
        hasValue={hasValue} label={selectedOption ? selectedOption.label : placeholder} />
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
      {createPortal(
        <AnimatePresence>
          {open && menuPosition && (
            <motion.div ref={menuRef} className={styles.dropdownMenu}
              style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background, left: menuPosition.left,
                width: menuPosition.width, top: menuPosition.top, bottom: menuPosition.bottom, transformOrigin: 'top'}}
              variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden"
              transition={{duration: 0.16, ease: [0.22, 1, 0.36, 1]}}>
              <DropdownSearchInput inputRef={inputRef} value={search} placeholder={searchPlaceholder}
                onChange={(event) => setSearch(event.target.value)} />
              <div className={styles.list}>
                {filteredOptions.length === 0 ? (
                  <p className={styles.empty} style={{color: COLORS.labels}}>Sin resultados</p>
                ) : (
                  filteredOptions.map((option) => (
                    <DropdownListItem key={String(option.value)} label={option.label}
                      selected={String(value ?? '') === String(option.value)} onClick={() => handleSelect(option)} />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default SearchableSelector;
