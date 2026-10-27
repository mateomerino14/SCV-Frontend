import {COLORS} from '../../../constants';
import WithholdingFormulaNote from '../atoms/WithholdingFormulaNote';

const styles = {
  card: "rounded-xl p-4",
  title: "text-xs font-bold font-inter uppercase mb-3",
  row: "flex justify-between items-center py-1.5 border-b",
  rowLast: "flex justify-between items-center py-1.5",
  label: "text-xs font-inter",
  value: "text-xs font-bold font-inter",
  total: "flex justify-between items-center pt-2 mt-1",
  totalText: "text-sm font-bold font-inter",
};

function WithholdingSummary({title, type, paid, withholdings}) {
  const rows = [{label: 'Monto pagado', value: paid, color: COLORS.text}];
  if (type === 'S') {
    rows.push({label: 'RC-IVA 13%', value: withholdings.rcIva, color: COLORS.secondary});
  }
  if (type === 'C') {
    rows.push({label: 'IUE 5%', value: withholdings.iue, color: COLORS.secondary});
  }
  rows.push({label: 'IT 3%', value: withholdings.it, color: COLORS.secondary});
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
      <p className={styles.title} style={{color: COLORS.environmentTypesText}}>{title}</p>
      {rows.map((row, index) => (
        <div key={row.label} className={index === rows.length - 1 ? styles.rowLast : styles.row} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.label} style={{color: COLORS.labels}}>{row.label}</p>
          <p className={styles.value} style={{color: row.color}}>Bs {row.value.toFixed(2)}</p>
        </div>
      ))}
      <div className={styles.total}>
        <p className={styles.totalText} style={{color: COLORS.title}}>Importe costo</p>
        <p className={styles.totalText} style={{color: COLORS.title}}>Bs {withholdings.cost.toFixed(2)}</p>
      </div>
      <WithholdingFormulaNote type={type} />
    </div>
  );
}

export default WithholdingSummary;
