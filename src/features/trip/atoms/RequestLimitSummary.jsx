import {COLORS} from '../../../constants';

const styles = {
  box: 'rounded-xl p-3 flex flex-col gap-1',
  row: 'flex justify-between gap-3 text-xs font-inter',
  total: 'flex justify-between gap-3 text-sm font-bold font-inter pt-1 mt-1 border-t',
};

function RequestLimitSummary({days, dailyRate, reference, lodging, limit, currency}) {
  return (
    <div className={styles.box} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.row} style={{color: COLORS.labels}}>
        <span>{days} día{days === 1 ? '' : 's'} × {dailyRate.toFixed(2)} {currency}</span>
        <span>{reference.toFixed(2)} {currency}</span>
      </div>
      <div className={styles.row} style={{color: COLORS.labels}}>
        <span>Hospedaje estimado</span>
        <span>{(parseFloat(lodging) || 0).toFixed(2)} {currency}</span>
      </div>
      <div className={styles.total} style={{color: COLORS.title, borderColor: COLORS.dataFields}}>
        <span>Tope a solicitar</span>
        <span>{limit.toFixed(2)} {currency}</span>
      </div>
    </div>
  );
}

export default RequestLimitSummary;
