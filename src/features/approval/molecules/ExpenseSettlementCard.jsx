import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';

const styles = {
  card: 'rounded-2xl p-5 mb-4',
  amount: 'text-2xl font-bold font-inter',
  label: 'text-sm font-inter mt-1',
  justificationBox: 'mt-2 p-3 rounded-xl text-xs font-inter',
  justificationTitle: 'text-xs font-bold font-inter uppercase mt-4 mb-2',
  divider: 'border-t my-3',
};

function ExpenseSettlementCard({amount, exceeds, isInternational, amountUsd, exceedsUsd, exceededDays = [], exceedsHotels, dayJustifications = {}}) {
  const safeAmount = parseFloat(amount) || 0;
  const safeAmountUsd = parseFloat(amountUsd) || 0;
  const hasDailyExcess = exceededDays.length > 0 || exceedsHotels;

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
      {hasDailyExcess && (
        <>
          <p className={styles.justificationTitle} style={{color: 'rgba(255,255,255,0.9)'}}>Días con exceso de cuota diaria</p>
          {exceededDays.map((day) => (
            <p key={day.fecha} className={styles.justificationBox} style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)'}}>
              <strong>{formatDateShort(day.fecha)}</strong> — {day.excedeBs ? `${day.montoBs.toFixed(2)} Bs` : `${day.montoUsd.toFixed(2)} USD`}
              {dayJustifications[day.fecha] ? `: ${dayJustifications[day.fecha]}` : ' (sin justificación)'}
            </p>
          ))}
          {exceedsHotels && (
            <p className={styles.justificationBox} style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)'}}>
              <strong>Hoteles</strong>{dayJustifications.HOTEL ? `: ${dayJustifications.HOTEL}` : ' (sin justificación)'}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseSettlementCard;