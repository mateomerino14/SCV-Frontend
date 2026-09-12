import {COLORS} from '../../constants';

const styles = {
  wrapper: 'mb-6',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitle: 'text-sm font-inter',
};

function PageHeader({title, subtitle}) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title} style={{color: COLORS.text}}>{title}</h1>
      {subtitle && <p className={styles.subtitle} style={{color: COLORS.labels}}>{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
