import {COLORS} from '../../../constants';
import ProfileRoleIcon from '../atoms/ProfileRoleIcon';

const styles = {
  badge: 'flex items-center gap-3 px-4 py-3 rounded-xl mt-3 w-full',
  label: 'text-xs font-bold font-inter uppercase',
  value: 'text-sm font-bold font-inter mt-0.5',
};

function ProfileRoleBadge({roleName}) {
  return (
    <div className={styles.badge} style={{backgroundColor: COLORS.error}}>
      <ProfileRoleIcon />
      <div>
        <p className={styles.label} style={{color: COLORS.labels}}>Rol de Sistema</p>
        <p className={styles.value} style={{color: COLORS.primary}}>{roleName || 'Usuario'}</p>
      </div>
    </div>
  );
}

export default ProfileRoleBadge;