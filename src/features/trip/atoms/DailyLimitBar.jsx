import {COLORS} from '../../../constants';
import {dailyLimitStatus, getLimitStatus} from '../constants/dailyLimitStatus';

const styles = {
  row: 'flex items-start gap-3',
  currency: 'text-[10px] font-bold font-inter rounded-md px-1.5 py-0.5 w-10 text-center shrink-0 border -mt-1',
  barBox: 'flex-1 min-w-0',
  track: 'w-full h-2.5 rounded-full overflow-hidden',
  fill: 'h-full rounded-full transition-all duration-700 ease-out',
  amounts: 'flex justify-between mt-1',
  amount: 'text-xs font-bold font-inter',
  limit: 'text-xs font-inter',
};

function DailyLimitBar({currency, amount = 0, limit = 0}) {
  const status = dailyLimitStatus[getLimitStatus(amount, limit)];
  let percentage = 0;
  if (limit > 0) {
    percentage = Math.min((amount / limit) * 100, 100);
  }
  return (
    <div className={styles.row}>
      <span className={styles.currency} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.title}}>{currency}</span>
      <div className={styles.barBox}>
        <div className={styles.track} style={{backgroundColor: COLORS.dataFields}}>
          <div className={styles.fill} style={{width: `${percentage}%`, backgroundColor: status.color}} />
        </div>
        <div className={styles.amounts}>
          <span className={styles.amount} style={{color: status.color}}>{amount.toFixed(2)} {currency}</span>
          <span className={styles.limit} style={{color: COLORS.labels}}>límite {limit.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default DailyLimitBar;
