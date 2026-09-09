import {COLORS} from '../../../constants';

const styles = {
  row: 'flex items-start gap-3 py-3 border-b',
  rowLast: 'flex items-start gap-3 py-3',
  icon: 'rounded-lg p-2 mt-0.5 shrink-0',
  label: 'text-xs font-inter uppercase mb-0.5',
  value: 'text-sm font-bold font-inter',
};

function ExpenseFieldRow({icon: Icon, label, value, last, iconBg = COLORS.backgroundHeader, iconColor = COLORS.title, valueColor = COLORS.text}) {
  return (
    <div className={last ? styles.rowLast : styles.row} style={{borderColor: last ? undefined : COLORS.dataFields}}>
      <div className={styles.icon} style={{backgroundColor: iconBg}}>
        <Icon size={16} style={{color: iconColor}} />
      </div>
      <div>
        <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
        <p className={styles.value} style={{color: valueColor}}>{value}</p>
      </div>
    </div>
  );
}

export default ExpenseFieldRow;