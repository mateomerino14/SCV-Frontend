import {tripStatusConfig} from '../hooks/useTripStatusConfig';

const styles = {
  badge: 'text-xs font-semibold font-inter px-3 py-1 rounded-full uppercase shrink-0 text-center leading-tight whitespace-normal max-w-[140px] sm:max-w-none',
};

function TripStatusBadge({status}) {
  const config = tripStatusConfig[status] || tripStatusConfig.BORRADOR;
  return <span className={styles.badge} style={{backgroundColor: config.bg, color: config.color}}>{config.label}</span>;
}

export default TripStatusBadge;