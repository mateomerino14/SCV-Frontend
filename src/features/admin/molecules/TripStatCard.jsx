import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-4 shadow-sm flex items-center gap-3',
  iconWrapper: 'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
  info: 'flex flex-col',
  value: 'text-2xl font-bold font-inter',
  label: 'text-xs font-inter',
};

function TripStatCard({icon: Icon, label, value, color, bg}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.iconWrapper} style={{backgroundColor: bg}}>
        <Icon size={18} style={{color}} />
      </div>
      <div className={styles.info}>
        <p className={styles.value} style={{color: COLORS.text}}>{value || 0}</p>
        <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
      </div>
    </div>
  );
}

export default TripStatCard;