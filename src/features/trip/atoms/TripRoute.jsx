import {Navigation, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  row: 'flex items-center gap-1 flex-wrap',
};

function TripRoute({origin, destination, size = 10, maxWidth = 100}) {
  if (!origin) {
    return (
      <div className={styles.row}>
        <MapPin size={size} style={{color: COLORS.secondary}} />
        <span className="truncate" style={{maxWidth, color: COLORS.labels}}>{destination}</span>
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <Navigation size={size} style={{color: COLORS.labels, flexShrink: 0}} />
      <span className="truncate" style={{maxWidth, color: COLORS.labels}}>{origin}</span>
      <span style={{color: COLORS.dataFields}}>→</span>
      <MapPin size={size} style={{color: COLORS.secondary, flexShrink: 0}} />
      <span className="truncate" style={{maxWidth, color: COLORS.labels}}>{destination}</span>
    </div>
  );
}

export default TripRoute;