import {Eye, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';
import ExpenseObsButton from '../atoms/ExpenseObsButton';
import DocumentNumberBadge from '../../expense/atoms/DocumentNumberBadge';
import {resolveDocumentNumber, documentSources} from '../../../utils/documentNumber';
import {getExpenseWithholdings} from '../../../utils/withholdings';

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

function ExpenseUninvoicedTable({expenses, onViewExpense, countObservations, onOpenObservations}) {
  if (expenses.length === 0) {
    return null;
  }
  const cell = (extra = {}) => ({...extra, borderColor: COLORS.dataFields});
  const hasSystemNumbers = expenses.some((expense) => resolveDocumentNumber(expense).source === documentSources.system);
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.monto_total || 0), 0);
  const withholdingList = expenses.map((expense) => getExpenseWithholdings(expense));
  const totalRcIva = withholdingList.reduce((sum, item) => sum + item.rcIva, 0);
  const totalIue = withholdingList.reduce((sum, item) => sum + item.iue, 0);
  const totalIt = withholdingList.reduce((sum, item) => sum + item.it, 0);
  const totalCost = withholdingList.reduce((sum, item) => sum + item.cost, 0);
  const hasAlcohol = expenses.some((expense) => expense.tiene_alcohol);

  return (
    <div className={styles.section}>
      <p className={styles.title} style={{color: COLORS.title}}>
        <MapPin size={14} style={{color: COLORS.title}} />
        Gastos sin Factura (Bs)
      </p>
      <p className={styles.subtitle} style={{color: COLORS.labels}}>Gastos varios sin respaldo de factura oficial</p>
      {hasAlcohol && (
        <p className={styles.subtitle} style={{color: COLORS.warningText}}>Las filas resaltadas contienen gastos no deducibles (alcohol o propinas)</p>
      )}
      {hasSystemNumbers && (
        <p className={styles.subtitle} style={{color: COLORS.systemReceiptText}}>Los N° de recibo en lila los asignó el sistema: el gasto no tiene recibo original</p>
      )}
      <div className={styles.tableWrapper} style={{borderColor: COLORS.dataFields}}>
        <table className={styles.table}>
          <thead>
            <tr style={{backgroundColor: COLORS.title}}>
              {['#', 'Fecha', 'Categoría / Concepto', 'Descripción', 'N° Recibo', 'Tipo', 'Importe (Bs)', 'RC-IVA', 'IUE', 'IT 3%', 'Costo', 'Obs.', ''].map((header) => (
                <th key={header} className={styles.th} style={{color: COLORS.background, borderColor: COLORS.onColorFill20}}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const amount = parseFloat(expense.monto_total || 0);
              const {rcIva, iue, it: itTax, cost} = withholdingList[index];
              let bg = COLORS.backgroundHeader;
              if (expense.tiene_alcohol) {
                bg = COLORS.warningBackground;
              }
              else if (index % 2 === 0) {
                bg = COLORS.background;
              }
              const subitems = expense.Gasto_Subitem || [];
              let description = expense.descripcion || '—';
              let descriptionColor = COLORS.labels;
              let descriptionWeight = 'normal';
              if (subitems.length > 0) {
                description = `${subitems.length} subgasto${subitems.length !== 1 ? 's' : ''}`;
                descriptionColor = COLORS.secondary;
                descriptionWeight = 'bold';
              }
              return (
                <tr key={expense.id_gasto} style={{backgroundColor: bg}}>
                  <td className={styles.td} style={cell({color: COLORS.labels})}>{index + 1}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{formatDateShort(expense.fecha_gasto)}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{expense.Categoria_Gasto?.nombre || expense.Proveedor?.nombre || '—'}</td>
                  <td className={styles.td} style={cell({color: descriptionColor, fontWeight: descriptionWeight})}>{description}</td>
                  <td className={styles.td} style={cell()}><DocumentNumberBadge {...resolveDocumentNumber(expense)} /></td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{typeLabels[expense.tipo] || expense.tipo}</td>
                  <td className={styles.td} style={cell({color: COLORS.title})}>{amount.toFixed(2)}</td>
                  <td className={styles.td} style={cell({color: rcIva > 0 ? COLORS.secondary : COLORS.labels})}>{rcIva > 0 ? rcIva.toFixed(2) : '—'}</td>
                  <td className={styles.td} style={cell({color: iue > 0 ? COLORS.secondary : COLORS.labels})}>{iue > 0 ? iue.toFixed(2) : '—'}</td>
                  <td className={styles.td} style={cell({color: itTax > 0 ? COLORS.secondary : COLORS.labels})}>{itTax > 0 ? itTax.toFixed(2) : '—'}</td>
                  <td className={styles.td} style={cell({color: COLORS.title})}>{cost.toFixed(2)}</td>
                  <td className={styles.td} style={cell({width: 36})}>
                    <ExpenseObsButton count={countObservations(expense.id_gasto)} accentColor={COLORS.title} onClick={() => onOpenObservations(expense.id_gasto)} />
                  </td>
                  <td className={styles.td} style={cell({width: 36})}>
                    <button className={styles.eyeBtn} style={{backgroundColor: COLORS.backgroundHeader, margin: '0 auto'}} onClick={() => onViewExpense(expense.id_gasto)}>
                      <Eye size={13} style={{color: COLORS.title}} />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr style={{backgroundColor: COLORS.backgroundHeader}}>
              <td colSpan={6} className={styles.td} style={cell({color: COLORS.title, fontWeight: 'bold'})}>TOTAL</td>
              <td className={styles.td} style={cell({color: COLORS.title, fontWeight: 'bold'})}>{totalAmount.toFixed(2)}</td>
              <td className={styles.td} style={cell({color: COLORS.secondary, fontWeight: 'bold'})}>{totalRcIva > 0 ? totalRcIva.toFixed(2) : '—'}</td>
              <td className={styles.td} style={cell({color: COLORS.secondary, fontWeight: 'bold'})}>{totalIue > 0 ? totalIue.toFixed(2) : '—'}</td>
              <td className={styles.td} style={cell({color: COLORS.secondary, fontWeight: 'bold'})}>{totalIt > 0 ? totalIt.toFixed(2) : '—'}</td>
              <td className={styles.td} style={cell({color: COLORS.title, fontWeight: 'bold'})}>{totalCost.toFixed(2)}</td>
              <td colSpan={2} className={styles.td} style={cell()} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseUninvoicedTable;