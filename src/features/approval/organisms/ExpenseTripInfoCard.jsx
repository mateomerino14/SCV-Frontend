import {MapPin, Navigation} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';
import {avatarDefault} from '../../../constants/defaultImages';


const styles = {
  card: 'rounded-2xl p-5 mb-4 shadow-md',
  employeeRow: 'flex flex-wrap items-start gap-3 mb-4',
  avatar: 'w-14 h-14 rounded-full object-cover border-2 shrink-0',
  employeeInfo: 'flex flex-col flex-1 min-w-0',
  employeeLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  employeeName: 'text-lg font-bold font-inter leading-tight break-words',
  employeePosition: 'text-xs font-inter',
  statusBadge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-full uppercase shrink-0 text-center leading-tight whitespace-normal max-w-[140px] sm:max-w-none',
  divider: 'border-t mb-4',
  reasonLabel: 'text-xs font-bold font-inter uppercase mb-1',
  reasonText: 'text-sm font-inter mb-4 font-semibold break-words',
  infoGrid: 'grid grid-cols-2 gap-4',
  infoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  infoValue: 'text-sm font-inter break-words',
  infoValueIcon: 'text-sm font-inter break-words flex items-center gap-1',
  routeFull: 'col-span-2 mt-1',
  routeRow: 'flex items-start gap-1.5 flex-wrap',
  routeText: 'break-words min-w-0',
};

const statusConfig = {
  EN_REVISION: {label: 'En Revisión', bg: COLORS.error, color: COLORS.secondary},
  EN_REVISION_APROBADOR: {label: 'Revisión por Alcohol', bg: '#f8d7da', color: '#721c24'},
  APROBADO_SUPERVISOR: {label: 'Apr. Preliminar', bg: '#85aff3ab', color: '#000a65'},
  APROBADO_APROBADOR: {label: 'Apr. Aprobador', bg: '#85aff3ab', color: '#000a65'},
  APROBADO_FINAL: {label: 'Aprobado', bg: '#d4edda', color: '#155724'},
  RECHAZADO: {label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203'},
};

function ExpenseTripInfoCard({trip}) {
  const status = statusConfig[trip.estado] || statusConfig.EN_REVISION;
  const isInternational = trip.tipo === 'Internacional';
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background}}>
      <div className={styles.employeeRow}>
        <img src={trip.Usuario?.foto_perfil || avatarDefault} alt="empleado" className={styles.avatar} style={{borderColor: COLORS.primary}}
          onError={(event) => {event.target.onerror = null; event.target.src = avatarDefault;}} />
        <div className={styles.employeeInfo}>
          <p className={styles.employeeLabel} style={{color: COLORS.secondary}}>Empleado Asignado</p>
          <p className={styles.employeeName} style={{color: COLORS.text}}>{trip.Usuario?.nombre} {trip.Usuario?.apellido_paterno}</p>
          <p className={styles.employeePosition} style={{color: COLORS.labels}}>{trip.Usuario?.Cargo?.nombre}</p>
        </div>
        <span className={styles.statusBadge} style={{backgroundColor: status.bg, color: status.color}}>{status.label}</span>
      </div>
      <p className={styles.reasonLabel} style={{color: COLORS.secondary}}>Motivo</p>
      <p className={styles.reasonText} style={{color: COLORS.text}}>{trip.motivo}</p>
      <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
      <div className={styles.infoGrid}>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Período</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>{formatDateShort(trip.fecha_inicio)} - {formatDateShort(trip.fecha_fin)}</p>
        </div>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Tipo</p>
          <p className={styles.infoValueIcon} style={{color: COLORS.text}}>
            <MapPin size={13} style={{color: isInternational ? COLORS.primary : COLORS.title}} />
            {isInternational ? 'Internacional' : 'Nacional'}
          </p>
        </div>
        {trip.transporte && (
          <div>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Transporte</p>
            <p className={styles.infoValue} style={{color: COLORS.text}}>
              {trip.transporte}{trip.placa_vehiculo ? ` — ${trip.placa_vehiculo}` : ''}
            </p>
          </div>
        )}
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Presupuesto</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>
            Bs {parseFloat(trip.monto_asignado || 0).toFixed(2)}
            {isInternational && parseFloat(trip.monto_asignado_usd || 0) > 0 && ` / USD ${parseFloat(trip.monto_asignado_usd).toFixed(2)}`}
          </p>
        </div>
        <div className={styles.routeFull}>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>{trip.origen ? 'Ruta' : 'Lugar'}</p>
          {trip.origen ? (
            <p className={styles.routeRow} style={{color: COLORS.text}}>
              <Navigation size={13} style={{color: COLORS.labels, marginTop: 2, flexShrink: 0}} />
              <span className={styles.routeText}>{trip.origen}</span>
              <span style={{color: COLORS.labels, flexShrink: 0}}>→</span>
              <MapPin size={13} style={{color: COLORS.secondary, marginTop: 2, flexShrink: 0}} />
              <span className={styles.routeText}>{trip.destino}</span>
            </p>
          ) : (
            <p className={styles.infoValue} style={{color: COLORS.text}}>{trip.destino}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseTripInfoCard;