import {COLORS} from '../../../constants';
import TripBalanceRow from '../atoms/TripBalanceRow';
import {showsUsdFund} from '../../../utils/expenseCurrency';

const styles = {
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  sectionTitle: 'text-xs font-bold font-inter uppercase mb-3',
  divider: 'border-t mb-4',
};

function TripBalanceSummary({trip, accumulatedExpense, accumulatedExpenseUsd, exceedsBudget, exceedsBudgetUsd, isInternational}) {
  const nationalBalance = parseFloat(trip.monto_asignado) - accumulatedExpense;
  const usdBalance = parseFloat(trip.monto_asignado_usd || 0) - accumulatedExpenseUsd;
  let nationalLabel = 'Saldo a devolver';
  let nationalColor = COLORS.title;
  if (exceedsBudget) {
    nationalLabel = 'Exceso a reembolsar';
    nationalColor = COLORS.secondary;
  }
  const hasUsdFund = isInternational && showsUsdFund(trip);
  let spentLabel = 'Gasto nacional';
  if (isInternational && !hasUsdFund) {
    spentLabel = 'Gasto total (nacional e internacional)';
  }
  let usdLabel = 'Saldo a devolver';
  let usdColor = COLORS.primary;
  if (exceedsBudgetUsd) {
    usdLabel = 'Exceso a reembolsar';
    usdColor = COLORS.secondary;
  }

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <p className={styles.sectionTitle} style={{color: COLORS.text_enviroment_types}}>Balance</p>
      <TripBalanceRow label="Fondo recibido (Bs)" value={`${parseFloat(trip.monto_asignado).toFixed(2)} Bs`} color={COLORS.text} />
      <TripBalanceRow label={spentLabel} value={`${accumulatedExpense.toFixed(2)} Bs`} color={COLORS.text} />
      <TripBalanceRow label={nationalLabel} value={`${Math.abs(nationalBalance).toFixed(2)} Bs`} color={nationalColor} />
      {hasUsdFund && (
        <>
          <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
          <TripBalanceRow label="Fondo recibido (USD)" value={`${parseFloat(trip.monto_asignado_usd || 0).toFixed(2)} USD`} color={COLORS.text} />
          <TripBalanceRow label="Gasto internacional" value={`${accumulatedExpenseUsd.toFixed(2)} USD`} color={COLORS.text} />
          <TripBalanceRow label={usdLabel} value={`${Math.abs(usdBalance).toFixed(2)} USD`} color={usdColor} />
        </>
      )}
    </div>
  );
}

export default TripBalanceSummary;