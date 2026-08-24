import {Globe, MapPin} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  badge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2 py-0.5 rounded-lg w-fit',
};

function TripTypeBadge({isInternational}) {
  if (isInternational) {
    return (
      <span className={styles.badge} style={{backgroundColor: COLORS.primary + '20', color: COLORS.primary}}>
        <Globe size={11} />
        Internacional
      </span>
    );
  }
  return (
    <span className={styles.badge} style={{backgroundColor: COLORS.title + '15', color: COLORS.title}}>
      <MapPin size={11} />
      Nacional
    </span>
  );
}

export default TripTypeBadge;