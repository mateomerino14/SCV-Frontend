import {DollarSign} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseSectionCard from '../molecules/ExpenseSectionCard';
import WithholdingFormulaNote from '../atoms/WithholdingFormulaNote';
import {getExpenseWithholdings} from '../../../utils/withholdings';

const styles = {
  row: 'flex justify-between items-center py-2 border-b',
  rowLast: 'flex justify-between items-center py-2',
  label: 'text-xs font-inter',
  value: 'text-xs font-bold font-inter',
  total: 'flex justify-between items-center pt-3 mt-1 border-t',
  totalLabel: 'text-sm font-bold font-inter',
  totalValue: 'text-sm font-bold font-inter',
};

const typeLabel = {C: 'Compra sin Factura', S: 'Servicio sin Factura'};

function ExpenseWithholdingsCard({expense}) {
  const total = parseFloat(expense.monto_total || 0);
  const {rcIva, iue, it, toPay} = getExpenseWithholdings(expense);
  return (
    <ExpenseSectionCard icon={DollarSign} title={`Retenciones — ${typeLabel[expense.tipo]}`}>
      <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
        <p className={styles.label} style={{color: COLORS.labels}}>Total del documento</p>
        <p className={styles.value} style={{color: COLORS.text}}>Bs {total.toFixed(2)}</p>
      </div>
      {rcIva > 0 && (
        <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.label} style={{color: COLORS.labels}}>RC-IVA 13%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {rcIva.toFixed(2)}</p>
        </div>
      )}
      {iue > 0 && (
        <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.label} style={{color: COLORS.labels}}>IUE 5%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {iue.toFixed(2)}</p>
        </div>
      )}
      {it > 0 && (
        <div className={styles.rowLast}>
          <p className={styles.label} style={{color: COLORS.labels}}>IT 3%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {it.toFixed(2)}</p>
        </div>
      )}
      <div className={styles.total} style={{borderColor: COLORS.dataFields}}>
        <p className={styles.totalLabel} style={{color: COLORS.title}}>Importe a cancelar</p>
        <p className={styles.totalValue} style={{color: COLORS.title}}>Bs {toPay.toFixed(2)}</p>
      </div>
      <WithholdingFormulaNote type={expense.tipo} />
    </ExpenseSectionCard>
  );
}

export default ExpenseWithholdingsCard;