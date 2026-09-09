import {COLORS} from '../../../constants';

const styles = {
  badge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2.5 py-1 rounded-full uppercase w-fit',
};

function TripTypeBadge({isInternational}) {
  if (isInternational) {
    return (
      <span className={styles.badge} style={{backgroundColor: COLORS.primary + '20', color: COLORS.primary}}>
        Internacional
      </span>
    );
  }
  return (
    <span className={styles.badge} style={{backgroundColor: COLORS.dataFields, color: COLORS.text}}>
      Nacional
    </span>
  );
}

export default TripTypeBadge;