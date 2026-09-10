import {UserCircle} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  circle: 'rounded-full p-2 shrink-0',
};

function ProfileRoleIcon() {
  return (
    <div className={styles.circle} style={{backgroundColor: COLORS.primary}}>
      <UserCircle size={20} style={{color: COLORS.background}} />
    </div>
  );
}

export default ProfileRoleIcon;