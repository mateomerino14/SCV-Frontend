import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {Navigation, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';
import {tripPath} from '../../../constants/routes';
import {formatDateRange} from '../../../utils/dateFormatter';
import BudgetProgressBlock from '../molecules/BudgetProgressBlock';
import useBudgetProgress from '../hooks/useBudgetProgress';

const styles = {
  container: "rounded-xl overflow-hidden shadow-lg flex flex-col h-full",
  emptyContainer: "rounded-xl p-8 text-white text-center flex flex-col items-center justify-center gap-2 h-full min-h-[280px]",
  topSection: "p-5 shrink-0",
  reason: "text-lg font-bold font-inter uppercase leading-tight mb-1 text-white line-clamp-2",
  date: "text-xs font-inter text-white mt-1",
  routeRow: "flex items-center gap-1 flex-wrap mt-1",
  routeText: "text-xs font-inter truncate",
  bottomSection: "p-4 flex flex-col flex-1",
  destinationRow: "flex flex-col gap-1 mb-2",
  destination: "font-inter font-semibold text-xs break-words",
  badgesRow: "flex gap-1 flex-wrap mb-1",
  badge: "text-xs font-bold font-nunito px-2 py-0.5 rounded-xl whitespace-nowrap",
  divider: "border-t mb-2 mt-1",
  detailsLink: "text-xs font-bold font-inter cursor-pointer mt-auto pt-2",
};

function InProgressTripCard({trip}) {
  const navigate = useNavigate();
  if (!trip) {
    return (
      <div className={styles.emptyContainer} style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})`}}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
          <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
        </svg>
        <p className="font-inter font-bold text-base">Sin viajes en curso</p>
        <p className="font-inter text-xs opacity-70">No tienes ningún viaje activo en este momento</p>
      </div>
    );
  }
  const {
    isInternational, nationalExpense, assignedAmount, nationalPercentage, exceedsNational,
    internationalExpense, assignedAmountUsd, internationalPercentage, exceedsInternational,
  } = useBudgetProgress(trip);
  const nationalLabel = isInternational ? 'Nacional (Bs)' : 'Gasto Acumulado';

  return (
    <motion.div className={styles.container} whileHover={{y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.14)'}} transition={{duration: 0.18}}>
      <div className={styles.topSection} style={{backgroundColor: COLORS.backgroundSecondary}}>
        {trip.esSustitucion && (
          <span className={styles.badge} style={{backgroundColor: 'rgba(255,255,255,0.25)', color: COLORS.background, marginBottom: 6, display: 'inline-block'}}>
            RENDICIÓN DE {trip.nombreTitular?.toUpperCase()}
          </span>
        )}
        <p className={styles.reason}>{trip.motivo?.toUpperCase()}</p>
        <p className={styles.date} style={{opacity: 0.7}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>
        {trip.origen && (
          <div className={styles.routeRow}>
            <Navigation size={10} style={{color: COLORS.background, opacity: 0.8, flexShrink: 0}} />
            <span className={styles.routeText} style={{color: COLORS.background, opacity: 0.85, maxWidth: 100}}>{trip.origen}</span>
            <span style={{color: COLORS.background, opacity: 0.5, flexShrink: 0}}>→</span>
            <MapPin size={10} style={{color: COLORS.background, opacity: 0.8, flexShrink: 0}} />
            <span className={styles.routeText} style={{color: COLORS.background, opacity: 0.85, maxWidth: 100}}>{trip.destino}</span>
          </div>
        )}
      </div>
      <div className={styles.bottomSection} style={{backgroundColor: COLORS.background}}>
        <div className={styles.destinationRow}>
          <div className={styles.badgesRow}>
            <span className={styles.badge} style={{backgroundColor: COLORS.travelTypes, color: COLORS.travelTypesText}}>{trip.tipo?.toUpperCase() || 'NACIONAL'}</span>
            {trip.transporte && (
              <span className={styles.badge} style={{backgroundColor: COLORS.environmentTypes, color: COLORS.environmentTypesText}}>{trip.transporte.toUpperCase()}</span>
            )}
          </div>
          {!trip.origen && <p className={styles.destination} style={{color: COLORS.labels}}>{trip.destino}</p>}
        </div>
        <BudgetProgressBlock label={nationalLabel} expense={nationalExpense} assignedAmount={assignedAmount}
          percentage={nationalPercentage} exceeds={exceedsNational} currency="Bs" />
        {isInternational && (
          <>
            <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
            <BudgetProgressBlock label="Internacional (USD)" expense={internationalExpense} assignedAmount={assignedAmountUsd}
              percentage={internationalPercentage} exceeds={exceedsInternational} currency="USD" valueFontSize="17px" />
          </>
        )}
        <p className={styles.detailsLink} style={{color: COLORS.title}} onClick={() => navigate(tripPath(trip.id_viaje))}>DETALLES →</p>
      </div>
    </motion.div>
  );
}

export default InProgressTripCard;