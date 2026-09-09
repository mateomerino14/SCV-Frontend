import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-4 shadow-sm flex items-center gap-3',
  iconWrapper: 'w-11 h-11 rounded-full flex items-center justify-center shrink-0',
  info: 'flex flex-col min-w-0',
  value: 'text-2xl font-bold font-inter',
  title: 'text-xs font-bold font-inter uppercase',
  subtitle: 'text-xs font-inter mt-0.5',
};

function PhaseTotalCard({icon: Icon, title, subtitle, total, color, bg}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.iconWrapper} style={{backgroundColor: bg}}>
        <Icon size={20} style={{color}} />
      </div>
      <div className={styles.info}>
        <p className={styles.value} style={{color: COLORS.text}}>{total}</p>
        <p className={styles.title} style={{color}}>{title}</p>
        <p className={styles.subtitle} style={{color: COLORS.labels}}>{subtitle}</p>
      </div>
    </div>
  );
}

export default PhaseTotalCard;