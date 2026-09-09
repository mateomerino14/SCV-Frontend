import {COLORS} from '../../constants';

const styles = {
  wrapper: 'rounded-2xl p-8 flex flex-col items-center gap-2 text-center',
  title: 'font-inter font-bold text-base',
  subtitle: 'font-inter text-xs opacity-70',
};

function EmptyState({title, subtitle, icon}) {
  return (
    <div className={styles.wrapper} style={{background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})`}}>
      {icon}
      <p className={styles.title} style={{color: COLORS.background}}>{title}</p>
      <p className={styles.subtitle} style={{color: COLORS.background}}>{subtitle}</p>
    </div>
  );
}

export default EmptyState;