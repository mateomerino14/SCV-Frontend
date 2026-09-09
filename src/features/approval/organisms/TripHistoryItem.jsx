import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {COLORS} from '../../../constants';
import {formatDateRange} from '../../../utils/dateFormatter';
import {tripStatusConfig} from '../hooks/useTripStatusConfig';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  card: 'rounded-2xl shadow-sm overflow-hidden flex flex-col',
  cardContent: 'p-4 flex flex-col flex-1',
  headerRow: 'flex items-center gap-3 mb-3',
  avatar: 'w-12 h-12 rounded-full object-cover shrink-0',
  employeeInfo: 'flex flex-col flex-1 min-w-0',
  employeeName: 'text-base font-semibold font-inter leading-tight',
  employeePosition: 'text-xs font-inter mt-0.5',
  employeeDates: 'text-xs font-inter mt-0.5',
  statusBadge: 'text-xs font-semibold font-inter px-2.5 py-1 rounded-full uppercase shrink-0',
  reasonLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  reason: 'text-sm font-semibold font-inter mb-3 leading-snug break-words',
  placeLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  place: 'text-sm font-inter mb-3',
  spacer: 'flex-1',
  divider: 'border-t mb-3',
  infoRow: 'flex justify-between items-end mb-4',
  infoItem: 'flex flex-col',
  infoLabel: 'text-xs font-semibold font-inter uppercase mb-0.5',
  infoValue: 'text-2xl font-semibold font-inter leading-none',
  infoSuffix: 'text-sm font-inter ml-1',
  statusRow: 'flex items-center gap-1.5',
  statusDot: 'w-2 h-2 rounded-full',
  statusText: 'text-sm font-inter',
  detailsBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center tracking-widest',
};

function TripHistoryItem({trip, detailRoute, originRoute}) {
  const navigate = useNavigate();
  const config = tripStatusConfig[trip.estado] || {label: trip.estado, color: COLORS.labels, bg: COLORS.backgroundHeader};
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
          <span className={styles.statusBadge} style={{backgroundColor: config.bg, color: config.color}}>{config.label}</span>
        </div>
        <p className={styles.reasonLabel} style={{color: COLORS.secondary}}>Motivo</p>
        <p className={styles.reason} style={{color: COLORS.text}}>{trip.motivo}</p>
        <p className={styles.placeLabel} style={{color: COLORS.secondary}}>Lugar</p>
        <p className={styles.place} style={{color: COLORS.text}}>{trip.destino}</p>
        <div className={styles.spacer} />
        <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Monto Total</p>
            <p style={{color: COLORS.text}}>
              <span className={styles.infoValue}>{parseFloat(trip.gastoAcumulado || 0).toFixed(2)}</span>
              <span className={styles.infoSuffix} style={{color: COLORS.labels}}>Bs</span>
            </p>
          </div>
          <div className={styles.infoItem}>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Estado</p>
            <div className={styles.statusRow}>
              <div className={styles.statusDot} style={{backgroundColor: config.color}} />
              <p className={styles.statusText} style={{color: config.color}}>{config.label}</p>
            </div>
          </div>
        </div>
        <button className={styles.detailsBtn} style={{backgroundColor: COLORS.title, color: COLORS.background}}
          onClick={() => navigate(detailRoute, {state: {from: originRoute}})}>Ver Detalles</button>
      </div>
    </motion.div>
  );
}

export default TripHistoryItem;