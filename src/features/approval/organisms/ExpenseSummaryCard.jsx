import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-5 mb-4 shadow-md',
  title: 'text-xs font-bold font-inter uppercase mb-3',
  row: 'flex justify-between items-center py-1.5',
  label: 'text-sm font-inter',
  value: 'text-sm font-bold font-inter',
  divider: 'border-t my-2',
};

function ExpenseSummaryCard({totalVat, netBalance, isInternational, netBalanceUsd}) {
  const safeVat = parseFloat(totalVat) || 0;
  const safeBalance = parseFloat(netBalance) || 0;
  const safeBalanceUsd = parseFloat(netBalanceUsd) || 0;

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
      <p className={styles.title} style={{color: COLORS.labels}}>Resumen de Totales</p>
      <div className={styles.row}>
        <p className={styles.label} style={{color: COLORS.labels}}>Total IVA Crédito</p>
        <p className={styles.value} style={{color: COLORS.text}}>Bs. {safeVat.toFixed(2)}</p>
      </div>
      <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
      <div className={styles.row}>
        <p className="text-sm font-bold font-inter" style={{color: COLORS.title}}>Saldo Neto (Bs)</p>
        <p className="text-sm font-bold font-inter" style={{color: COLORS.title}}>Bs. {safeBalance.toFixed(2)}</p>
      </div>
      {isInternational && (
        <div className={styles.row}>
          <p className="text-sm font-bold font-inter" style={{color: COLORS.primary}}>Saldo Neto (USD)</p>
          <p className="text-sm font-bold font-inter" style={{color: COLORS.primary}}>USD {safeBalanceUsd.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseSummaryCard;  