import {COLORS} from '../../../constants';

const styles = {
  label: 'text-xs font-nunito font-bold uppercase mb-1',
  amount: 'text-2xl font-semibold font-inter',
  sub: 'text-sm font-inter ml-2',
  bar: 'w-full rounded-full h-2 mt-2',
  fill: 'h-2 rounded-full transition-all',
  pct: 'text-xs font-inter mt-1',
};

function ExpenseBudgetBar({accumulated, assignedAmount, isUsd}) {
  const safeAccumulated = parseFloat(accumulated) || 0;
  const safeAssigned = parseFloat(assignedAmount) || 0;
  const percentage = safeAssigned > 0 ? Math.min((safeAccumulated / safeAssigned) * 100, 100) : 0;
  const exceeds = percentage >= 100;
  const barColor = exceeds ? COLORS.secondary : COLORS.title;
  const currency = isUsd ? 'USD' : 'Bs';

  return (
    <div>
      <p className={styles.label} style={{color: COLORS.labels}}>{isUsd ? 'Presupuesto Internacional (USD)' : 'Presupuesto Gastado'}</p>
      <p style={{color: exceeds ? COLORS.secondary : COLORS.text}}>
        <span className={styles.amount}>{safeAccumulated.toFixed(2)} {currency}</span>
        <span className={styles.sub} style={{color: COLORS.title}}>/ {safeAssigned.toFixed(2)} {currency}</span>
      </p>
      <div className={styles.bar} style={{backgroundColor: COLORS.dataFields}}>
        <div className={styles.fill} style={{width: `${percentage}%`, backgroundColor: barColor}} />
      </div>
      <p className={styles.pct} style={{color: COLORS.title}}>{percentage.toFixed(0)}% del límite alcanzado</p>
    </div>
  );
}

export default ExpenseBudgetBar;