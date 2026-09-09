import {ArrowUp} from 'lucide-react';
import {COLORS} from '../../../constants';
import useTripBalance from '../hooks/useTripBalance';

const styles = {
  wrapper: "flex items-center justify-between p-4 rounded-2xl shadow-lg my-5",
  left: "flex items-center gap-3",
  iconWrapper: "rounded-full p-2",
  info: "flex flex-col",
  label: "text-xs font-bold font-inter uppercase",
  status: "text-xs font-inter mt-0.5",
  amountWrapper: "flex flex-col items-end",
  amount: "text-2xl font-bold font-inter",
  currency: "text-xs font-inter",
};

function TripRefundBanner({accumulatedExpense, assignedAmount}) {
  const {difference, hasSurplus} = useTripBalance(accumulatedExpense, assignedAmount);
  if (!hasSurplus) {
    return null;
  }

  return (
    <div className={styles.wrapper} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{backgroundColor: COLORS.dataFields}}>
          <ArrowUp size={20} style={{color: COLORS.title}} />
        </div>
        <div className={styles.info}>
          <p className={styles.label} style={{color: COLORS.text}}>Balance</p>
          <p className={styles.status} style={{color: COLORS.title}}>Estado: Retorno</p>
        </div>
      </div>
      <div className={styles.amountWrapper}>
        <p className={styles.amount} style={{color: COLORS.title}}>{difference.toFixed(2)}</p>
        <p className={styles.currency} style={{color: COLORS.labels}}>Bs</p>
      </div>
    </div>
  );
}

export default TripRefundBanner;