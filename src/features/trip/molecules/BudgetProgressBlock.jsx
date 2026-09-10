import {COLORS} from '../../../constants';

const styles = {
  amountRow: "flex justify-between items-center mb-0.5",
  progressBar: "w-full h-1.5 rounded mt-0.5 mb-2",
  progress: "h-1.5 rounded",
};

function BudgetProgressBlock({label, expense, assignedAmount, percentage, exceeds, currency, valueFontSize = '18px'}) {
  return (
    <>
      <div className={styles.amountRow}>
        <div>
          <p style={{color: COLORS.text, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2}}>{label}</p>
          <p style={{color: exceeds ? COLORS.secondary : COLORS.title, fontSize: valueFontSize, fontWeight: 'bold'}}>{expense.toFixed(2)} {currency}</p>
        </div>
        <p style={{color: COLORS.labels, fontSize: '14px', textAlign: 'right'}}>/ {assignedAmount.toFixed(2)} {currency}</p>
      </div>
      <div className={styles.progressBar} style={{backgroundColor: COLORS.bar}}>
        <div className={styles.progress} style={{width: `${percentage}%`, backgroundColor: exceeds ? COLORS.secondary : COLORS.title}} />
      </div>
    </>
  );
}

export default BudgetProgressBlock;