import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-5 mb-4',
  amount: 'text-2xl font-bold font-inter',
  label: 'text-sm font-inter mt-1',
  justificationBox: 'mt-3 p-3 rounded-xl text-xs font-inter',
  divider: 'border-t my-3',
};

function ExpenseSettlementCard({amount, exceeds, isInternational, amountUsd, exceedsUsd, justification}) {
  const safeAmount = parseFloat(amount) || 0;
  const safeAmountUsd = parseFloat(amountUsd) || 0;

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
      <p className={styles.amount} style={{color: COLORS.background}}>Bs {safeAmount.toFixed(2)}</p>
      <p className={styles.label} style={{color: 'rgba(255,255,255,0.8)'}}>
        {exceeds ? 'A Reembolsar al Empleado (Bs)' : 'A devolver a la empresa (Bs)'}
      </p>
      {isInternational && (
        <>
          <div className={styles.divider} style={{borderColor: 'rgba(255,255,255,0.2)'}} />
          <p className={styles.amount} style={{color: COLORS.background}}>USD {safeAmountUsd.toFixed(2)}</p>
          <p className={styles.label} style={{color: 'rgba(255,255,255,0.8)'}}>
            {exceedsUsd ? 'A Reembolsar al Empleado (USD)' : 'A devolver a la empresa (USD)'}
          </p>
        </>
      )}
      {(exceeds || exceedsUsd) && justification && (
        <p className={styles.justificationBox} style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)'}}>
          Justificación: {justification.descripcion}
        </p>
      )}
    </div>
  );
}

export default ExpenseSettlementCard;