import {createPortal} from 'react-dom';
import DropdownTrigger from '../../../components/ui/DropdownTrigger';
import DropdownSearchInput from '../../../components/ui/DropdownSearchInput';
import DropdownListItem from '../../../components/ui/DropdownListItem';
import {COLORS} from '../../../constants';
import usePositionSelector from '../hooks/usePositionSelector';

const styles = {
  wrapper: "relative",
  label: "text-xs font-bold font-inter uppercase mb-1",
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
  list: "max-h-52 overflow-y-auto",
  empty: "px-4 py-3 text-sm font-inter text-center",
  fieldError: "text-xs font-inter mt-1",
};

function PositionSelector({positions, positionId, onChange, error}) {
  const {
    open, search, setSearch, menuPosition, wrapperRef, triggerRef, menuRef, inputRef, selectedPosition,
    filteredPositions, handleToggle, handleSelect,
  } = usePositionSelector(positions, positionId, onChange);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <p className={styles.label} style={{color: COLORS.labels}}>Cargo</p>
      <DropdownTrigger triggerRef={triggerRef} open={open} onClick={handleToggle} error={error}
        hasValue={!!selectedPosition} label={selectedPosition ? selectedPosition.nombre : 'Seleccionar cargo'} />
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}

      {open && menuPosition && createPortal(
        <div ref={menuRef} className={styles.dropdownMenu}
          style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background, left: menuPosition.left,
          width: menuPosition.width, top: menuPosition.top, bottom: menuPosition.bottom}}>
          <DropdownSearchInput inputRef={inputRef} value={search} placeholder="Buscar cargo..."
            onChange={(event) => setSearch(event.target.value)} />

          <div className={styles.list}>
            {filteredPositions.length === 0 ? (<p className={styles.empty} style={{color: COLORS.labels}}>Sin resultados</p>) : (
              filteredPositions.map((position) => (
                <DropdownListItem key={position.id_cargo} label={position.nombre}
                  selected={String(positionId) === String(position.id_cargo)} onClick={() => handleSelect(position)} />)))
            }
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default PositionSelector;