import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-xl p-4 flex items-start gap-3 border h-full',
  iconWrapper: 'rounded-lg p-2 shrink-0',
  info: 'flex flex-col min-w-0',
  label: 'text-xs font-inter uppercase',
  value: 'text-sm font-bold font-inter mt-0.5 break-words',
};

function ReadOnlyField({icon: Icon, label, value}) {
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.iconWrapper} style={{backgroundColor: COLORS.error}}>
        <Icon size={16} style={{color: COLORS.primary}} />
      </div>
      <div className={styles.info}>
        <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
        <p className={styles.value} style={{color: COLORS.text}}>{value || '—'}</p>
      </div>
    </div>
  );
}

export default ReadOnlyField;