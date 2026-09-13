import {Pencil} from 'lucide-react';
import {COLORS} from '../../../constants';
import ProfileRoleBadge from '../molecules/ProfileRoleBadge';
import {avatarDefault} from '../../../constants/defaultImages';


const styles = {
  card: 'rounded-2xl p-6 shadow-sm border flex flex-col items-center h-fit',
  avatarContainer: 'relative',
  avatar: 'w-28 h-28 rounded-full object-cover border-4 shadow-md',
  editBtn: 'absolute bottom-0 right-0 rounded-full p-2 shadow-md cursor-pointer border-2',
  name: 'text-lg font-bold font-inter mt-4 text-center break-words',
};

function ProfileSummaryCard({user, onEditPhoto, saving}) {
  const fullName = `${user?.nombre || ''} ${user?.apellido_paterno || ''}`.trim();

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <div className={styles.avatarContainer}>
        <img src={user?.foto_perfil || avatarDefault} alt="avatar" className={styles.avatar} style={{borderColor: COLORS.primary}} />
        <button className={styles.editBtn} style={{backgroundColor: COLORS.primary, borderColor: COLORS.background}} onClick={onEditPhoto} disabled={saving}>
          <Pencil size={14} style={{color: COLORS.background}} />
        </button>
      </div>
      <p className={styles.name} style={{color: COLORS.text}}>{fullName}</p>
      <ProfileRoleBadge roleName={user?.Rol?.nombre} />
    </div>
  );
}

export default ProfileSummaryCard;