import {Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  note: 'text-xs font-inter',
  row: 'grid grid-cols-[minmax(0,1fr)_7.5rem_2.75rem] gap-2 items-center',
  box: 'rounded-xl border px-3 py-2.5 flex items-center gap-1.5 min-w-0',
  input: 'w-full min-w-0 bg-transparent outline-none font-inter text-sm',
  suffix: 'text-xs font-bold font-inter shrink-0',
  removeBtn: 'w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent',
  error: 'text-xs font-inter -mt-1.5',
  addBtn: 'self-start py-2 font-bold font-inter text-sm cursor-pointer bg-transparent border-none',
  total: 'flex justify-between items-center border-t pt-3 text-sm font-bold font-inter',
};

const borderOf = (error) => {
  if (error) {
    return COLORS.fieldErrorBorder;
  }
  return COLORS.dataFields;
};

function SubitemsEditor({subitems, errors, currency, total, disabled, onAdd, onRemove, onDescriptionChange, onAmountChange}) {
  const canRemove = subitems.length > 1 && !disabled;
  return (
    <>
      <p className={styles.note} style={{color: COLORS.labels}}>El monto se calcula solo como la suma de estos subgastos.</p>
      {subitems.map((subitem, index) => {
        const subitemErrors = errors[subitem.id] || {};
        const message = [subitemErrors.description, subitemErrors.amount].filter(Boolean).join(' · ');
        return (
          <div key={subitem.id} className="flex flex-col gap-2">
            <div className={styles.row}>
              <label className={styles.box} style={{borderColor: borderOf(subitemErrors.description)}}>
                <input type="text" placeholder="Descripción, ej: Taxi al hotel" maxLength={255} disabled={disabled} aria-label={`Descripción del subgasto ${index + 1}`}
                  className={styles.input} style={{color: COLORS.text}} value={subitem.description} onChange={(event) => onDescriptionChange(subitem.id, event.target.value)} />
              </label>
              <label className={styles.box} style={{borderColor: borderOf(subitemErrors.amount)}}>
                <input type="text" inputMode="decimal" placeholder="0.00" disabled={disabled} aria-label={`Monto del subgasto ${index + 1}`}
                  className={styles.input} style={{color: COLORS.text}} value={subitem.amount} onChange={(event) => onAmountChange(subitem.id, event.target.value)} />
                <span className={styles.suffix} style={{color: COLORS.labels}}>{currency}</span>
              </label>
              {canRemove && (
                <button type="button" className={styles.removeBtn} aria-label={`Quitar subgasto ${index + 1}`} onClick={() => onRemove(subitem.id)}>
                  <Trash2 size={16} style={{color: COLORS.secondary}} />
                </button>
              )}
            </div>
            {message && <p className={styles.error} style={{color: COLORS.fieldError}}>{message}</p>}
          </div>
        );
      })}
      {!disabled && (
        <button type="button" className={styles.addBtn} style={{color: COLORS.primary}} onClick={onAdd}>+ Agregar subgasto</button>
      )}
      <div className={styles.total} style={{borderColor: COLORS.dataFields, color: COLORS.text}}>
        <span>Total</span>
        <span style={{color: COLORS.primary}}>{total.toFixed(2)} {currency}</span>
      </div>
    </>
  );
}

export default SubitemsEditor;
