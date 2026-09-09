import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'mb-5',
  title: 'text-lg font-bold font-inter uppercase',
  accent: 'w-10 h-1 rounded-full mt-1.5 mb-3',
  divider: 'border-t',
};

function ProfileSectionTitle({children}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title} style={{color: COLORS.labels}}>{children}</p>
      <div className={styles.accent} style={{backgroundColor: COLORS.primary}} />
      <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
    </div>
  );
}

export default ProfileSectionTitle;