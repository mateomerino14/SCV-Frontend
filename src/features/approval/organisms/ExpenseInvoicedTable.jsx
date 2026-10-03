import {Eye, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';
import ExpenseObsButton from '../atoms/ExpenseObsButton';

const typeLabels = {F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio'};

const styles = {
  section: 'mb-6',
  title: 'text-sm font-bold font-inter uppercase mb-2 flex items-center gap-2',
  subtitle: 'text-xs font-inter mb-3',
  tableWrapper: 'overflow-x-auto rounded-xl border',
  table: 'w-full text-xs font-inter border-collapse',
  th: 'px-3 py-2.5 text-center font-bold uppercase text-xs border-b border-r last:border-r-0 whitespace-nowrap',
  td: 'px-3 py-2.5 border-b border-r last:border-r-0 text-center whitespace-nowrap',
  eyeBtn: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0',
};

function ExpenseInvoicedTable({expenses, onViewExpense, countObservations, onOpenObservations}) {
  if (expenses.length === 0) {
    return null;
  }
  const cell = (extra = {}) => ({...extra, borderColor: COLORS.dataFields});
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.monto_total || 0), 0);
  const hasAlcohol = expenses.some((expense) => expense.tiene_alcohol);

  return (
    <div className={styles.section}>
      <p className={styles.title} style={{color: COLORS.title}}>
        <MapPin size={14} style={{color: COLORS.title}} />
        Gastos con Factura (Bs)
      </p>
      <p className={styles.subtitle} style={{color: COLORS.labels}}>Gastos respaldados con factura o recibo oficial</p>
      {hasAlcohol && (
        <p className={styles.subtitle} style={{color: '#856404'}}>Las filas resaltadas contienen bebidas alcohólicas</p>
      )}
      <div className={styles.tableWrapper} style={{borderColor: COLORS.dataFields}}>
        <table className={styles.table}>
          <thead>
            <tr style={{backgroundColor: COLORS.primary}}>
              {['#', 'Fecha', 'Proveedor', 'Descripción', 'Tipo', 'N° Doc.', 'NIT/CI', 'Importe (Bs)', 'IVA (Bs)', 'Obs.', ''].map((header) => (
                <th key={header} className={styles.th} style={{color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)'}}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const amount = parseFloat(expense.monto_total || 0);
              const vat = Math.max(0, amount - parseFloat(expense.Factura?.monto_parcial || 0));
              const bg = expense.tiene_alcohol ? '#fef3cd' : (index % 2 === 0 ? COLORS.background : COLORS.backgroundHeader);
              return (
                <tr key={expense.id_gasto} style={{backgroundColor: bg}}>
                  <td className={styles.td} style={cell({color: COLORS.labels})}>{index + 1}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{formatDateShort(expense.Factura?.fecha_emision || expense.fecha_gasto)}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{expense.Proveedor?.nombre || '—'}</td>
                  <td className={styles.td} style={cell({color: COLORS.labels})}>{expense.descripcion || `N° ${expense.Factura.numero_factura}`}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{typeLabels[expense.tipo] || expense.tipo}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{expense.Factura?.numero_factura || '—'}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{expense.Proveedor?.numero_doc_fiscal || '—'}</td>
                  <td className={styles.td} style={cell({color: COLORS.title})}>{amount.toFixed(2)}</td>
                  <td className={styles.td} style={cell({color: COLORS.labels})}>{vat > 0 ? vat.toFixed(2) : '—'}</td>
                  <td className={styles.td} style={cell({width: 36})}>
                    <ExpenseObsButton count={countObservations(expense.id_gasto)} accentColor={COLORS.primary} onClick={() => onOpenObservations(expense.id_gasto)} />
                  </td>
                  <td className={styles.td} style={cell({width: 36})}>
                    <button className={styles.eyeBtn} style={{backgroundColor: COLORS.backgroundHeader, margin: '0 auto'}} onClick={() => onViewExpense(expense.id_gasto)}>
                      <Eye size={13} style={{color: COLORS.primary}} />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr style={{backgroundColor: COLORS.backgroundHeader}}>
              <td colSpan={7} className={styles.td} style={cell({color: COLORS.title, fontWeight: 'bold'})}>TOTAL</td>
              <td className={styles.td} style={cell({color: COLORS.title, fontWeight: 'bold'})}>{total.toFixed(2)}</td>
              <td colSpan={3} className={styles.td} style={cell()} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseInvoicedTable;