import {DollarSign} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseSectionCard from '../molecules/ExpenseSectionCard';

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
  return (
    <ExpenseSectionCard icon={DollarSign} title={`Retenciones — ${typeLabel[expense.tipo]}`}>
      <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
        <p className={styles.label} style={{color: COLORS.labels}}>Monto pagado</p>
        <p className={styles.value} style={{color: COLORS.text}}>Bs {parseFloat(expense.monto_total).toFixed(2)}</p>
      </div>
      <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
        <p className={styles.label} style={{color: COLORS.labels}}>Base imponible</p>
        <p className={styles.value} style={{color: COLORS.text}}>Bs {parseFloat(expense.base_imponible || 0).toFixed(2)}</p>
      </div>
      {expense.tipo === 'S' && parseFloat(expense.retencion_rc_iva || 0) > 0 && (
        <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.label} style={{color: COLORS.labels}}>RC-IVA 13%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {parseFloat(expense.retencion_rc_iva).toFixed(2)}</p>
        </div>
      )}
      {expense.tipo === 'C' && parseFloat(expense.retencion_iue || 0) > 0 && (
        <div className={styles.row} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.label} style={{color: COLORS.labels}}>IUE 5%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {parseFloat(expense.retencion_iue).toFixed(2)}</p>
        </div>
      )}
      {parseFloat(expense.retencion_it || 0) > 0 && (
        <div className={styles.rowLast}>
          <p className={styles.label} style={{color: COLORS.labels}}>IT 3%</p>
          <p className={styles.value} style={{color: COLORS.secondary}}>Bs {parseFloat(expense.retencion_it).toFixed(2)}</p>
        </div>
      )}
      <div className={styles.total} style={{borderColor: COLORS.dataFields}}>
        <p className={styles.totalLabel} style={{color: COLORS.title}}>Importe Costo</p>
        <p className={styles.totalValue} style={{color: COLORS.title}}>Bs {parseFloat(expense.importe_costo || 0).toFixed(2)}</p>
      </div>
    </ExpenseSectionCard>
  );
}

export default ExpenseWithholdingsCard;