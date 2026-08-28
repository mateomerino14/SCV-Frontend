import {Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import useInvoiceDetailPanel from '../../../hooks/expense/useInvoiceDetailPanel';

const styles = {
  wrapper: "mt-4 shadow-md p-5 rounded-xl",
  sectionTitle: "text-sm font-bold font-inter uppercase mb-3",
  tableWrapper: "border rounded-xl overflow-hidden",
  tableHeader: "grid gap-1 font-bold uppercase py-2 text-xs font-nunito text-center rounded-tl-xl rounded-tr-xl",
  tableScroll: "overflow-y-scroll max-h-77",
  tableRow: "grid gap-1 py-2 items-center text-xs font-inter text-center border-b",
  iconWrapper: "flex items-center justify-center",
  btnsRow: "flex gap-2 mt-4",
  addBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center",
};

const gridColumns = {gridTemplateColumns: '2fr 1fr 1fr 1fr'};

const fields = [
  {key: 'nombre_producto', label: 'Descripción', type: 'text'},
  {key: 'precio', label: 'Precio', type: 'number'},
  {key: 'cantidad', label: 'Cantidad', type: 'number'},
];

function InvoiceDetailPanel({detail, onAdd, onRemove, saved = false}) {
  const hasManyItems = detail.length > 9;
  const {item, selectedIndex, fieldErrors, handleSelectRow, handleFieldChange, handleAdd, handleModify} = useInvoiceDetailPanel(detail, onAdd, onRemove);

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Detalle de Productos / Servicios</p>

      <div className={styles.tableWrapper} style={{borderColor: COLORS.dataFields}}>
        <div className={styles.tableHeader} style={{color: COLORS.background, backgroundColor: COLORS.backgroundSecondary, ...gridColumns, paddingRight: hasManyItems ? '17px' : '0px'}}>
          <span>Descripción</span>
          <span>Cant.</span>
          <span>Precio</span>
          <span>Acciones</span>
        </div>
        <div className={hasManyItems ? styles.tableScroll : ''}>
          {detail.map((row, index) => (
            <div key={index} className={styles.tableRow} onClick={() => !saved && handleSelectRow(index)}
              style={{borderColor: COLORS.dataFields, backgroundColor: selectedIndex === index ? COLORS.backgroundHeader : 'transparent', cursor: saved ? 'default' : 'pointer', ...gridColumns}}>
              <span className="px-1 text-left" style={{color: COLORS.text}}>{row.nombre_producto}</span>
              <span style={{color: COLORS.text}}>{row.cantidad}</span>
              <span style={{color: COLORS.text}}>{parseFloat(row.precio).toFixed(2)} Bs</span>
              <div className={styles.iconWrapper}>
                {!saved && <Trash2 size={14} style={{color: COLORS.secondary, cursor: 'pointer'}} onClick={(event) => {event.stopPropagation(); onRemove(index);}} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!saved && (
        <>
          <div className="flex flex-col gap-3" style={{marginTop: hasManyItems ? '0.5rem' : '1.3rem'}}>
            {fields.map(({key, label, type}) => (
              <ExpenseField key={key} label={label} error={fieldErrors[key]}>
                <input type={type === 'number' ? 'text' : type} inputMode={key === 'precio' ? 'decimal' : key === 'cantidad' ? 'numeric' : 'text'}
                  className="w-full bg-transparent outline-none font-inter text-xs" style={{color: COLORS.text}}
                  value={item[key]} maxLength={key === 'nombre_producto' ? 50 : undefined} onChange={(event) => handleFieldChange(key, event.target.value)} />
              </ExpenseField>
            ))}
          </div>

          <div className={styles.btnsRow}>
            <button className={styles.addBtn} style={{backgroundColor: COLORS.primary, color: COLORS.background}} onClick={handleAdd}>Agregar</button>
            <button className={styles.addBtn} disabled={selectedIndex === null} onClick={handleModify}
              style={{backgroundColor: selectedIndex !== null ? COLORS.secondary : COLORS.dataFields, color: selectedIndex !== null ? COLORS.background : COLORS.labels}}>
              Modificar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default InvoiceDetailPanel;