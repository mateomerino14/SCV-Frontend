import {COLORS} from '../../../constants';
import TripBudgetRow from '../molecules/TripBudgetRow';

const cityImage = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800";

const styles = {
  wrapper: "flex flex-col gap-4",
  card: "rounded-2xl p-6 text-white",
  presupuestoLabel: "text-xs font-inter uppercase opacity-80 mb-1",
  title: "text-2xl font-bold font-inter mb-4",
  amountLabel: "text-xs font-inter uppercase opacity-70 mt-4 mb-1 text-center",
  amount: "text-5xl font-bold font-inter text-center",
  amountSub: "text-lg font-inter opacity-70",
  amountDivider: "border-t border-white border-opacity-20 my-3",
  amountUsdLabel: "text-xs font-inter uppercase opacity-70 mb-1 text-center",
  amountUsd: "text-4xl font-bold font-inter text-center",
  limitText: "text-xs font-inter opacity-70 text-center mt-1",
  infoBox: "rounded-xl p-3 flex gap-2 items-start mt-4",
  infoText: "text-xs font-inter opacity-80 mt-1",
  cityCard: "rounded-2xl overflow-hidden relative h-44",
  cityImage: "w-full h-full object-cover",
  cityOverlay: "absolute bottom-0 left-0 right-0 p-3",
  cityTitle: "text-white font-bold font-inter text-sm",
  citySubtitle: "text-white font-inter text-xs opacity-70 uppercase",
};

function TripBudgetSummary({position, dailyRate, dailyRateUsd, days, type, transport, requestedAmount, requestedAmountUsd, limitBs, limitUsd}) {
  const isInternational = type === 'Internacional';
  const borderColor = 'rgba(255,255,255,0.2)';
  let infoText = 'Indica cuánto necesitas: no puede superar los días por la tarifa diaria más el hospedaje. Tesorería asignará el monto final.';
  if (isInternational) {
    infoText = 'Puedes gastar en Bs o en USD cualquier día del viaje. Cada moneda tiene su propio límite diario y su propio tope a solicitar.';
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})`}}>
        <p className={styles.presupuestoLabel}>Presupuesto Solicitado</p>
        <p className={styles.title}>Resumen Corporativo</p>
        <TripBudgetRow label="Cargo" value={position?.toUpperCase() || '—'} borderColor={borderColor} />
        <TripBudgetRow label="Tarifa Diaria (Bs)" value={`${dailyRate.toFixed(2)} Bs`} borderColor={borderColor} />
        {isInternational && (
          <TripBudgetRow label="Tarifa Diaria (USD)" value={`${(dailyRateUsd || 0).toFixed(2)} USD`} borderColor={borderColor} />
        )}
        <TripBudgetRow label="Transporte" value={transport || '—'} borderColor={borderColor} />
        <TripBudgetRow label="Días de viaje" value={`${days} día${days !== 1 ? 's' : ''}`} borderColor={borderColor} />
        <p className={styles.amountLabel}>Monto Solicitado {isInternational && 'en Bs'}</p>
        <p className={styles.amount}>{(parseFloat(requestedAmount) || 0).toFixed(2)} <span className={styles.amountSub}>Bs</span></p>
        <p className={styles.limitText}>Tope: {(limitBs || 0).toFixed(2)} Bs</p>
        {isInternational && (
          <>
            <div className={styles.amountDivider} />
            <p className={styles.amountUsdLabel}>Monto Solicitado en USD</p>
            <p className={styles.amountUsd}>{(parseFloat(requestedAmountUsd) || 0).toFixed(2)} <span className={styles.amountSub}>USD</span></p>
            <p className={styles.limitText}>Tope: {(limitUsd || 0).toFixed(2)} USD</p>
          </>
        )}
        <div className={styles.infoBox} style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
          <span style={{color: 'rgba(255,255,255,0.7)', fontSize: 16}}>ⓘ</span>
          <p className={styles.infoText}>{infoText}</p>
        </div>
      </div>
      <div className={styles.cityCard}>
        <img src={cityImage} alt="ciudad" className={styles.cityImage} />
        <div className={styles.cityOverlay} style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
          <p className={styles.cityTitle}>Centro de Convenciones</p>
          <p className={styles.citySubtitle}>Zona Ejecutiva</p>
        </div>
      </div>
    </div>
  );
}

export default TripBudgetSummary;