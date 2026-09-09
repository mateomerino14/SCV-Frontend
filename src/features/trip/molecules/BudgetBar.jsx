import {COLORS} from '../../../constants';
import useBudgetPercentage from '../hooks/useBudgetPercentage';

const styles = {
  wrapper: "flex flex-col gap-1 mb-2",
  label: "text-xs font-nunito font-bold uppercase",
  barBackground: "w-full rounded-full h-2",
  barFill: "h-2 rounded-full transition-all",
  amounts: "flex justify-between text-xs font-inter mt-1",
};

function BudgetBar({accumulatedExpense, assignedAmount, isUsd = false}) {
  const assignedAmountNum = parseFloat(assignedAmount) || 0;
  const {percentage, exceeds} = useBudgetPercentage(accumulatedExpense, assignedAmountNum);
  const currency = isUsd ? 'USD' : 'Bs';

  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.environmentTypesText}}>
        {isUsd ? 'Presupuesto Internacional (USD)' : 'Presupuesto Gastado'}
      </p>
      <p style={{color: exceeds ? COLORS.secondary : COLORS.text, fontSize: '22px', fontWeight: '600'}}>
        {accumulatedExpense.toFixed(2)} {currency}
        <span style={{color: exceeds ? COLORS.secondary : COLORS.title, fontSize: '14px', fontWeight: '500'}}> / {assignedAmountNum.toFixed(2)} {currency}</span>
      </p>
      <div className={styles.barBackground} style={{backgroundColor: COLORS.dataFields}}>
        <div className={styles.barFill} style={{width: `${percentage}%`, backgroundColor: exceeds ? COLORS.secondary : COLORS.title}} />
      </div>
      <div className={styles.amounts}>
        <span style={{color: COLORS.title}}>{percentage.toFixed(0)}% del límite alcanzado</span>
      </div>
    </div>
  );
}

export default BudgetBar;