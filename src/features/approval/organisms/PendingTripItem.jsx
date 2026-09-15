import {motion} from 'framer-motion';
import {Globe, MapPin, Calendar, AlertTriangle, CheckCircle2} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateRange} from '../../../utils/dateFormatter';
import {tripStatusConfig, reviewStatusConfig} from '../hooks/useTripStatusConfig';
import TripRoute from '../../trip/atoms/TripRoute';
import TripTypeBadge from '../../trip/atoms/TripTypeBadge';
import TransportIcon from '../atoms/TransportIcon';
import TripActionButtons from '../molecules/TripActionButtons';
import {avatarDefault} from '../../../constants/defaultImages';


const statusPendingByField = {
  id_supervisor_asignado: 'EN_REVISION_VIAJE',
  id_aprobador_asignado: 'APROBADO_VIAJE',
  id_tesorero_asignado: 'EN_REVISION_TESORERO',
};

const styles = {
  container: "flex flex-col p-5 shadow-sm border mb-3 rounded-2xl gap-4",
  info: "flex flex-col min-w-0 gap-2",
  reason: "text-sm font-bold font-inter leading-tight break-words",
  dateRow: "flex items-center gap-1",
  dateText: "text-xs font-nunito",
  badgesRow: "flex gap-1 flex-wrap",
  transportBadge: "text-xs font-bold font-inter px-2 py-0.5 rounded-lg flex items-center gap-1",
  amountRow: "flex gap-3 flex-wrap",
  amountText: "text-xs font-inter",
  statusCol: "flex flex-col gap-1.5 items-end shrink-0",
  reviewBadge: "text-xs font-bold font-inter px-2 py-1 rounded-lg text-center whitespace-nowrap flex items-center gap-1",
};

function PendingTripItem({trip, detailRoute, originRoute, onTake, onReturn, taking, assignedField = 'id_supervisor_asignado', detailLabel = 'Ver Detalle'}) {
  const status = tripStatusConfig[trip.estado] || tripStatusConfig['EN_REVISION_VIAJE'];
  const isInternational = trip.tipo === 'Internacional';
  const unassigned = !trip[assignedField];
  const pendingStatus = statusPendingByField[assignedField];
  const canReturn = !!onReturn && !unassigned && trip.estado === pendingStatus;
  const reviewInfo = trip.estadoRevision ? reviewStatusConfig[trip.estadoRevision] : null;
  const ReviewIcon = reviewInfo?.label === 'Observado' ? AlertTriangle : CheckCircle2;

  return (
    <motion.div className={styles.container} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}
      whileHover={{y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.08)'}} transition={{duration: 0.18}}>
      <div className="flex items-start justify-between gap-3">
        {trip.Usuario ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={trip.Usuario.foto_perfil || avatarDefault} alt="empleado" className="w-11 h-11 rounded-full object-cover border shrink-0"
              style={{borderColor: COLORS.dataFields}} onError={(event) => {event.target.onerror = null; event.target.src = avatarDefault;}} />
            <div className="min-w-0">
              <p className="text-sm font-bold font-inter truncate" style={{color: COLORS.text}}>{trip.Usuario.nombre} {trip.Usuario.apellido_paterno}</p>
              {trip.Usuario.numero_seccion && <p className="text-xs font-inter truncate" style={{color: COLORS.labels}}>{trip.Usuario.numero_seccion}</p>}
            </div>
          </div>
        ) : <div />}
        <div className={styles.statusCol}>
          <span className="text-xs font-bold font-inter px-2 py-1 rounded-xl text-center whitespace-nowrap" style={{backgroundColor: status.bg, color: status.color}}>{status.label}</span>
          {reviewInfo && (
            <span className={styles.reviewBadge} style={{backgroundColor: reviewInfo.bg, color: reviewInfo.color}}>
              <ReviewIcon size={11} />
              {reviewInfo.label}
            </span>
          )}
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.reason} style={{color: COLORS.text}}>{trip.motivo}</p>
        <div className={styles.dateRow}>
          <Calendar size={11} style={{color: COLORS.labels}} />
          <p className={styles.dateText} style={{color: COLORS.labels}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>
        </div>
        <TripRoute origin={trip.origen} destination={trip.destino} size={10} maxWidth={100} />
        <div className={styles.badgesRow}>
          <TripTypeBadge isInternational={isInternational} />
          {trip.transporte && (
            <span className={styles.transportBadge} style={{backgroundColor: COLORS.title + '15', color: COLORS.title}}>
              <TransportIcon transport={trip.transporte} color={COLORS.title} />
              {trip.transporte}
            </span>
          )}
        </div>
        <div className={styles.amountRow}>
          <p className={styles.amountText} style={{color: COLORS.environmentTypesText}}><span className="font-bold">Bs:</span> {parseFloat(trip.monto_asignado).toFixed(2)}</p>
          {isInternational && parseFloat(trip.monto_asignado_usd || 0) > 0 && (
            <p className={styles.amountText} style={{color: COLORS.primary}}><span className="font-bold">USD:</span> {parseFloat(trip.monto_asignado_usd).toFixed(2)}</p>
          )}
        </div>
      </div>
      <TripActionButtons detailRoute={detailRoute} originRoute={originRoute} onTake={unassigned ? onTake && (() => onTake(trip.id_viaje)) : null}
        taking={taking} onReturn={onReturn && (() => onReturn(trip.id_viaje))} canReturn={canReturn} detailLabel={detailLabel} />
    </motion.div>
  );
}

export default PendingTripItem;