import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {Pencil, Send, Calendar, Wallet, Globe} from 'lucide-react';
import {COLORS} from '../../../constants';
import {routes, editTripPath} from '../../../constants/routes';
import {formatDateRange} from '../../../utils/dateFormatter';
import TripRoute from '../atoms/TripRoute';
import TripTypeBadge from '../atoms/TripTypeBadge';

const styles = {
  card: 'rounded-2xl p-4 shadow-md flex flex-col gap-3 h-full',
  headerRow: 'flex items-center justify-end',
  reason: 'text-base font-bold font-inter leading-tight break-words line-clamp-2',
  infoRow: 'flex items-center gap-1.5 text-xs font-inter',
  amountsRow: 'flex flex-col gap-1 mt-1 p-2.5 rounded-xl',
  amountLine: 'flex items-center justify-between text-xs font-inter',
  amountValue: 'font-bold',
  buttonsRow: 'flex gap-2 mt-auto',
  button: 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors',
};

function DraftTripCard({trip, onSubmit, submitting}) {
  const navigate = useNavigate();
  const isInternational = trip.tipo === 'Internacional';

  return (
    <motion.div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}
      whileHover={{y: -3, boxShadow: '0 10px 24px rgba(0,0,0,0.10)'}} transition={{duration: 0.18}}>
      <div className={styles.headerRow}>
        <TripTypeBadge isInternational={isInternational} />
      </div>
      <p className={styles.reason} style={{color: COLORS.text}} title={trip.motivo}>{trip.motivo || 'Sin motivo'}</p>
      <TripRoute origin={trip.origen} destination={trip.destino || 'Sin destino'} size={13} maxWidth={130} />
      <div className={styles.infoRow} style={{color: COLORS.labels}}>
        <Calendar size={13} style={{color: COLORS.labels}} />
        {formatDateRange(trip.fecha_inicio, trip.fecha_fin)}
      </div>
      <div className={styles.amountsRow} style={{backgroundColor: COLORS.backgroundHeader}}>
        <div className={styles.amountLine}>
          <span style={{color: COLORS.labels, display: 'flex', alignItems: 'center', gap: 4}}>
            <Wallet size={12} style={{color: COLORS.title}} />
            Fondo Nacional (Bs)
          </span>
          <span className={styles.amountValue} style={{color: COLORS.title}}>{parseFloat(trip.monto_asignado || 0).toFixed(2)}</span>
        </div>
        {isInternational && (
          <div className={styles.amountLine}>
            <span style={{color: COLORS.labels, display: 'flex', alignItems: 'center', gap: 4}}>
              <Globe size={12} style={{color: COLORS.primary}} />
              Fondo Internacional (USD)
            </span>
            <span className={styles.amountValue} style={{color: COLORS.primary}}>{parseFloat(trip.monto_asignado_usd || 0).toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className={styles.buttonsRow}>
        <button className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}}
          onClick={() => navigate(editTripPath(trip.id_viaje), {state: {from: routes.employeeDashboard}})}>
          <Pencil size={14} />
          Editar
        </button>
        <button className={styles.button} disabled={submitting} onClick={() => onSubmit(trip.id_viaje)}
          style={{backgroundColor: submitting ? COLORS.fields : COLORS.secondary, color: COLORS.background, borderColor: submitting ? COLORS.fields : COLORS.secondary}}>
          <Send size={14} />
          {submitting ? 'Enviando...' : 'Enviar a Revisión'}
        </button>
      </div>
    </motion.div>
  );
}

export default DraftTripCard;