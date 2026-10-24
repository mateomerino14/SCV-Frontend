import {COLORS} from '../../../constants';

const styles = {
  badge: 'inline-flex items-center gap-1 text-xs font-bold font-inter px-2.5 py-1 rounded-full uppercase w-fit',
};

function TripTransportBadge({transport}) {
  if (!transport) {
    return null;
  }
  return (
    <span className={styles.badge} style={{backgroundColor: COLORS.dataFields, color: COLORS.text}}>
      {transport}
    </span>
  );
}

export default TripTransportBadge;
