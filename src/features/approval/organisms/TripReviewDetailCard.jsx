import {Navigation, MapPin, Globe} from 'lucide-react';
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
  reasonText: 'text-sm font-inter mb-3 font-semibold break-words',
  infoGrid: 'grid grid-cols-2 gap-4',
  infoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  infoValue: 'text-sm font-inter break-words',
  infoRoute: 'text-sm font-inter flex items-start gap-1 flex-wrap',
  routeText: 'break-words min-w-0',
};

const defaultStatusConfig = {
  EN_REVISION_VIAJE: {label: 'Pendiente de Revisión', bg: '#e8d5ff', color: '#5b00a0'},
  APROBADO_VIAJE: {label: 'Aprobado por Supervisor', bg: '#ffd700aa', color: '#7a5900'},
  EN_REVISION_TESORERO: {label: 'Enviado a Tesorería', bg: '#ffd8a8aa', color: '#8a4b00'},
  RECHAZADO: {label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203'},
};

function TripReviewDetailCard({trip, statusConfig}) {
  const activeConfig = statusConfig || defaultStatusConfig;
  const status = activeConfig[trip.estado] || Object.values(activeConfig)[0];
  const isInternational = trip.tipo === 'Internacional';
  let typeIcon = <MapPin size={13} style={{color: COLORS.title}} />;
  if (isInternational) {
    typeIcon = <Globe size={13} style={{color: COLORS.primary}} />;
  }

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background}}>
      <div className={styles.employeeRow}>
        <img src={trip.Usuario?.foto_perfil || avatarDefault} alt="empleado" className={styles.avatar} style={{borderColor: COLORS.primary}}
          onError={(event) => {event.target.onerror = null; event.target.src = avatarDefault;}} />
        <div className={styles.employeeInfo}>
          <p className={styles.employeeLabel} style={{color: COLORS.secondary}}>Empleado</p>
          <p className={styles.employeeName} style={{color: COLORS.text}}>{trip.Usuario?.nombre} {trip.Usuario?.apellido_paterno}</p>
          <p className={styles.employeePosition} style={{color: COLORS.labels}}>
            {trip.Usuario?.Cargo?.nombre}
            {trip.Usuario?.Seccion?.nombre && ` · ${trip.Usuario.Seccion?.nombre}`}
          </p>
        </div>
        <span className={styles.statusBadge} style={{backgroundColor: status.bg, color: status.color}}>{status.label}</span>
      </div>
      <p className={styles.reasonLabel} style={{color: COLORS.secondary}}>Motivo del Viaje</p>
      <p className={styles.reasonText} style={{color: COLORS.text}}>{trip.motivo}</p>
      <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
      <div className={styles.infoGrid}>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Período</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>{formatDateShort(trip.fecha_inicio)} - {formatDateShort(trip.fecha_fin)}</p>
        </div>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Tipo</p>
          <p className={styles.infoValue} style={{color: COLORS.text, display: 'flex', alignItems: 'center', gap: 4}}>
            {typeIcon}
            {trip.tipo}
          </p>
        </div>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Transporte</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>
            {trip.transporte || '—'}{trip.placa_vehiculo ? ` — ${trip.placa_vehiculo}` : ''}
          </p>
        </div>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Presupuesto</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>
            Bs {parseFloat(trip.monto_asignado).toFixed(2)}
            {isInternational && trip.monto_asignado_usd > 0 && ` / USD ${parseFloat(trip.monto_asignado_usd).toFixed(2)}`}
          </p>
        </div>
        {trip.origen && (
          <div style={{gridColumn: '1 / -1'}}>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Ruta</p>
            <p className={styles.infoRoute} style={{color: COLORS.text}}>
              <Navigation size={12} style={{color: COLORS.labels, marginTop: 3, flexShrink: 0}} />
              <span className={styles.routeText}>{trip.origen}</span>
              <span style={{color: COLORS.dataFields, margin: '0 4px', flexShrink: 0}}>→</span>
              <MapPin size={12} style={{color: COLORS.secondary, marginTop: 3, flexShrink: 0}} />
              <span className={styles.routeText}>{trip.destino}</span>
            </p>
          </div>
        )}
        {!trip.origen && (
          <div>
            <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Destino</p>
            <p className={styles.infoValue} style={{color: COLORS.text}}>{trip.destino}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripReviewDetailCard;