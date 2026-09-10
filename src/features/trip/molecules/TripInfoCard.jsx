import {Navigation, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateRange} from '../../../utils/dateFormatter';
import TripTypeBadge from '../atoms/TripTypeBadge';
import TripStatusBadge from '../atoms/TripStatusBadge';

const styles = {
  card: 'rounded-2xl p-5 shadow-md mb-4 border',
  headerRow: 'flex items-start justify-between mb-4 gap-3',
  title: 'text-2xl font-bold font-inter leading-tight break-words',
  badgesRow: 'flex gap-2 mb-4 flex-wrap',
  divider: 'border-t mb-4',
  infoGrid: 'grid grid-cols-2 gap-4',
  infoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  infoValue: 'text-sm font-inter break-words',
  infoRoute: 'text-sm font-inter flex items-start gap-1 flex-wrap',
  routeText: 'break-words min-w-0',
};

function TripInfoCard({trip, isInternational}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <div className={styles.headerRow}>
        <h1 className={styles.title} style={{color: COLORS.text}}>{trip.motivo || 'Sin motivo'}</h1>
        <TripStatusBadge status={trip.estado} />
      </div>
      <div className={styles.badgesRow}>
        <TripTypeBadge isInternational={isInternational} />
        {trip.transporte && (
          <span className="text-xs font-semibold font-inter px-3 py-1 rounded-full uppercase" style={{backgroundColor: COLORS.dataFields, color: COLORS.text}}>{trip.transporte}</span>
        )}
      </div>
      <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
      <div className={styles.infoGrid}>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Período</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>{formatDateRange(trip.fecha_inicio, trip.fecha_fin)}</p>
        </div>
        <div>
          <p className={styles.infoLabel} style={{color: COLORS.secondary}}>Presupuesto</p>
          <p className={styles.infoValue} style={{color: COLORS.text}}>
            Bs {parseFloat(trip.monto_asignado || 0).toFixed(2)}
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

export default TripInfoCard;