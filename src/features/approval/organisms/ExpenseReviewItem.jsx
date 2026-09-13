import {motion} from 'framer-motion';
import {AlertTriangle, CheckCircle, Globe, MapPin} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {COLORS} from '../../../constants';
import {formatDateRange} from '../../../utils/dateFormatter';
import {alertConfig, tripStatusConfig} from '../hooks/useTripStatusConfig';
import TripRoute from '../../trip/atoms/TripRoute';
import TransportIcon from '../atoms/TransportIcon';
import TripActionButtons from '../molecules/TripActionButtons';
import {avatarDefault} from '../../../constants/defaultImages';


const styles = {
  card: 'rounded-2xl shadow-sm overflow-hidden flex flex-col',
  cardContent: 'p-4 flex flex-col flex-1',
  headerRow: 'flex items-center gap-3 mb-3',
  avatar: 'w-12 h-12 rounded-full object-cover shrink-0',
  employeeInfo: 'flex flex-col flex-1 min-w-0',
  employeeName: 'text-sm font-semibold font-inter leading-tight truncate',
  employeePosition: 'text-xs font-inter mt-0.5 truncate',
  employeeDates: 'text-xs font-inter mt-0.5',
  conformityBadge: 'text-xs font-semibold font-inter px-2 py-1 rounded-full uppercase shrink-0 flex items-center gap-1 max-w-[110px] truncate',
  reasonLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  reason: 'text-sm font-semibold font-inter mb-3 leading-snug line-clamp-2 break-words',
  placeLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  badgesRow: 'flex gap-1.5 flex-wrap mb-3',
  internationalBadge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
  transportBadge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
  spacer: 'flex-1',
  divider: 'border-t mb-3',
  infoRow: 'flex justify-between items-end mb-2',
  infoItem: 'flex flex-col min-w-0',
  infoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5 flex items-center gap-1',
  infoValue: 'text-xl font-semibold font-inter leading-none',
  infoValueSm: 'text-base font-semibold font-inter leading-none',
  infoSuffix: 'text-sm font-inter ml-1',
  statusRow: 'flex items-center gap-1.5',
  statusDot: 'w-2 h-2 rounded-full shrink-0',
  statusText: 'text-xs font-inter',
  alertsRow: 'flex gap-2 flex-wrap mb-3',
  alertBadge: 'text-xs font-bold font-inter px-2.5 py-1 rounded-lg flex items-center gap-1',
};

function ExpenseReviewItem({trip, detailRoute, originRoute, onTake, onReturn, taking}) {
  const navigate = useNavigate();
  const isObserved = trip.estadoRevision === 'OBSERVADO';
  const isInternational = trip.tipo === 'Internacional';
  const statusConfig = tripStatusConfig[trip.estado];

  return (
    <motion.div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}
      whileHover={{y: -3, boxShadow: '0 10px 24px rgba(0,0,0,0.10)'}} transition={{duration: 0.18}}>
      <div className={styles.cardContent}>
        <div className={styles.headerRow}>
          <img src={trip.Usuario?.foto_perfil || avatarDefault} alt="empleado" className={styles.avatar} />
          <div className={styles.employeeInfo}>
            <p className={styles.employeeName} style={{color: COLORS.text}}>{trip.Usuario?.nombre} {trip.Usuario?.apellido_paterno}</p>
            <p className={styles.employeePosition} style={{color: COLORS.labels}}>{trip.Usuario?.Cargo?.nombre}</p>
            <p className={styles.employeeDates} style={{color: COLORS.labels}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>
          </div>
          <span className={styles.conformityBadge} style={{backgroundColor: isObserved ? COLORS.error : '#d4edda', color: isObserved ? COLORS.secondary : '#155724'}}>
            {isObserved ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
            <span className="truncate">{isObserved ? 'Observado' : 'Conforme'}</span>
          </span>
        </div>
        <p className={styles.reasonLabel} style={{color: COLORS.secondary}}>Motivo</p>
        <p className={styles.reason} style={{color: COLORS.text}}>{trip.motivo}</p>
        <p className={styles.placeLabel} style={{color: COLORS.secondary}}>{trip.origen ? 'Ruta' : 'Lugar'}</p>
        <TripRoute origin={trip.origen} destination={trip.destino} size={10} maxWidth={180} />
        {(isInternational || trip.transporte) && (
          <div className={styles.badgesRow}>
            {isInternational && (
              <span className={styles.internationalBadge} style={{backgroundColor: COLORS.primary + '20', color: COLORS.primary}}>
                <Globe size={11} />
                Viaje Internacional
              </span>
            )}
            {trip.transporte && (
              <span className={styles.transportBadge} style={{backgroundColor: COLORS.title + '15', color: COLORS.title}}>
                <TransportIcon transport={trip.transporte} color={COLORS.title} />
                {trip.transporte}
              </span>
            )}
          </div>
        )}
        <div className={styles.spacer} />
        <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{color: COLORS.title}}><MapPin size={11} style={{color: COLORS.title}} />Monto Nacional</p>
            <p style={{color: COLORS.text}}>
              <span className={isInternational ? styles.infoValueSm : styles.infoValue}>{parseFloat(trip.gastoAcumulado || 0).toFixed(2)}</span>
              <span className={styles.infoSuffix} style={{color: COLORS.labels}}>Bs</span>
            </p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Estado</p>
            <div className={styles.statusRow}>
              <div className={styles.statusDot} style={{backgroundColor: statusConfig?.color || '#f59e0b'}} />
              <p className={styles.statusText} style={{color: COLORS.labels}}>{statusConfig?.label || 'Pendiente'}</p>
            </div>
          </div>
        </div>
        {isInternational && (
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel} style={{color: COLORS.primary}}><Globe size={11} style={{color: COLORS.primary}} />Monto Internacional</p>
              <p style={{color: COLORS.text}}>
                <span className={styles.infoValueSm}>{parseFloat(trip.gastoAcumuladoUsd || 0).toFixed(2)}</span>
                <span className={styles.infoSuffix} style={{color: COLORS.labels}}>USD</span>
              </p>
            </div>
          </div>
        )}
        {trip.alertas?.length > 0 && (
          <div className={styles.alertsRow}>
            {trip.alertas.map((alert) => {
              const config = alertConfig[alert];
              if (!config) {
                return null;
              }
              return (
                <span key={alert} className={styles.alertBadge} style={{backgroundColor: config.bg, color: config.color}}>
                  <AlertTriangle size={11} />{config.label}
                </span>
              );
            })}
          </div>
        )}
        <TripActionButtons detailRoute={detailRoute} originRoute={originRoute} onTake={onTake ? () => onTake(trip.id_viaje) : null}
          taking={taking} onReturn={onReturn ? () => onReturn(trip.id_viaje) : null} canReturn={!!onReturn && !onTake} detailLabel="Revisar Detalles" />
      </div>
    </motion.div>
  );
}

export default ExpenseReviewItem;