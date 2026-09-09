import {Eye, Globe} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';
import ExpenseObsButton from '../atoms/ExpenseObsButton';

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

function ExpenseInternationalTable({expenses, onViewExpense, countObservations, onOpenObservations}) {
  if (expenses.length === 0) {
    return null;
  }
  const cell = (extra = {}) => ({...extra, borderColor: COLORS.dataFields});
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.monto_total || 0), 0);

  return (
    <div className={styles.section}>
      <p className={styles.title} style={{color: COLORS.primary}}>
        <Globe size={14} style={{color: COLORS.primary}} />
        Gastos Internacionales (USD)
      </p>
      <p className={styles.subtitle} style={{color: COLORS.labels}}>Gastos realizados en el extranjero</p>
      <div className={styles.tableWrapper} style={{borderColor: COLORS.dataFields}}>
        <table className={styles.table}>
          <thead>
            <tr style={{backgroundColor: COLORS.primary}}>
              {['#', 'Fecha', 'Concepto', 'Descripción', 'Conversión', 'Importe (USD)', 'Obs.', ''].map((header) => (
                <th key={header} className={styles.th} style={{color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)'}}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const amount = parseFloat(expense.monto_total || 0);
              const installments = expense.Gasto_Tramo_Moneda || [];
              const subitems = expense.Gasto_Subitem || [];
              const hasInstallments = installments.length > 0;
              const hasSubitems = subitems.length > 0;
              const bg = index % 2 === 0 ? COLORS.background : COLORS.backgroundHeader;
              let description = expense.descripcion || '—';
              let descriptionColor = COLORS.labels;
              let descriptionWeight = 'normal';
              if (hasSubitems) {
                description = `${subitems.length} subgasto${subitems.length !== 1 ? 's' : ''}`;
                descriptionColor = COLORS.secondary;
                descriptionWeight = 'bold';
              }
              let conversion = 'USD directo';
              let conversionColor = COLORS.labels;
              let conversionWeight = 'normal';
              if (hasInstallments) {
                conversion = `${installments.length} tramo${installments.length !== 1 ? 's' : ''}`;
                conversionColor = COLORS.secondary;
                conversionWeight = 'bold';
              }
              return (
                <tr key={expense.id_gasto} style={{backgroundColor: bg}}>
                  <td className={styles.td} style={cell({color: COLORS.labels})}>{index + 1}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{formatDateShort(expense.fecha_gasto)}</td>
                  <td className={styles.td} style={cell({color: COLORS.text})}>{expense.Categoria_Gasto?.nombre || expense.Proveedor?.nombre || '—'}</td>
                  <td className={styles.td} style={cell({color: descriptionColor, fontWeight: descriptionWeight})}>{description}</td>
                  <td className={styles.td} style={cell({color: conversionColor, fontWeight: conversionWeight})}>{conversion}</td>
                  <td className={styles.td} style={cell({color: COLORS.primary})}>{amount.toFixed(2)}</td>
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
              <td colSpan={5} className={styles.td} style={cell({color: COLORS.primary, fontWeight: 'bold'})}>TOTAL</td>
              <td className={styles.td} style={cell({color: COLORS.primary, fontWeight: 'bold'})}>{total.toFixed(2)}</td>
              <td colSpan={2} className={styles.td} style={cell()} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseInternationalTable;