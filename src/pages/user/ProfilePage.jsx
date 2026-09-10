import {useNavigate} from 'react-router-dom';
import {Mail, Phone, Briefcase, LogOut, Hash, Layers} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PhotoModal from '../../features/user/organisms/PhotoModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import SuccessModal from '../../components/ui/SuccessModal';
import InlineAlert from '../../components/ui/InlineAlert';
import ProfileSummaryCard from '../../features/user/organisms/ProfileSummaryCard';
import ProfileSectionTitle from '../../features/user/molecules/ProfileSectionTitle';
import ProfileField from '../../features/user/molecules/ProfileField';
import ReadOnlyField from '../../features/user/atoms/ReadOnlyField';
import SkeletonCard from '../../components/ui/SkeletonCard';
import useProfile from '../../hooks/user/useProfile';
import useMenu from '../../hooks/shared/useMenu';
import usePhotoModal from '../hooks/usePhotoModal';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  titleWrapper: "mb-6",
  title: "text-3xl font-bold font-inter mb-1",
  subtitle: "text-sm font-inter",
  grid: "grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6",
  leftCol: "lg:col-span-3 min-w-[220px]",
  rightCol: "lg:col-span-9",
  sectionCard: "rounded-2xl p-6 shadow-sm border",
  fieldsGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch",
  logoutBtn: "w-full py-3.5 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 flex items-center justify-center gap-2 transition-colors",
};

function ProfilePage() {
  const navigate = useNavigate();
  const {menuOpen, user: menuUser, openMenu, closeMenu, loadUser, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    user, loading, error, success, closeSuccess, saving,
    phone, setPhone, email, setEmail,
    editingPhone, setEditingPhone, editingEmail, setEditingEmail,
    handleSavePhone, handleSaveEmail, handleRemovePhoto, handleCancelPhone, handleCancelEmail, handleChangePhoto,
  } = useProfile();
  const {showModal: showPhotoModal, open: openPhotoModal, close: closePhotoModal, handleNewPhoto, handleRemovePhoto: handleRemovePhotoModal} =
    usePhotoModal(handleChangePhoto, handleRemovePhoto, loadUser);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(routes.login);
  };

  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Perfil Corporativo" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={5} /></div>
        <Footer />
      </div>
    );
  }
  const hasCodes = user?.numero_dependencia || user?.numero_seccion;

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Perfil Corporativo" onMenuClick={openMenu} profilePhoto={menuUser?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <PhotoModal isOpen={showPhotoModal} onClose={closePhotoModal} onNewPhoto={handleNewPhoto} onRemove={handleRemovePhotoModal} saving={saving} />
      <SuccessModal isOpen={!!success} title="Actualizado" message={success} onAccept={closeSuccess} />
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title} style={{color: COLORS.text}}>Mi Cuenta</h1>
          <p className={styles.subtitle} style={{color: COLORS.labels}}>Consulta y edita tu información personal.</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <ProfileSummaryCard user={user} onEditPhoto={openPhotoModal} saving={saving} />
          </div>
          <div className={styles.rightCol}>
            <div className={styles.sectionCard} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
              <ProfileSectionTitle>Información Personal</ProfileSectionTitle>
              <div className={styles.fieldsGrid}>
                <ProfileField icon={Mail} label="Correo Corporativo" value={user?.email_corporativo} editing={editingEmail} editValue={email}
                  onEditValueChange={(event) => setEmail(event.target.value)} onStartEdit={() => setEditingEmail(true)}
                  onSave={handleSaveEmail} onCancel={handleCancelEmail} saving={saving} inputType="email" inputMode="email" maxLength={100} />
                <ProfileField icon={Phone} label="Teléfono" value={user?.telefono} editing={editingPhone} editValue={phone}
                  onEditValueChange={(event) => setPhone(event.target.value.replace(/[^0-9]/g, ''))} onStartEdit={() => setEditingPhone(true)}
                  onSave={handleSavePhone} onCancel={handleCancelPhone} saving={saving} inputType="tel" inputMode="numeric" maxLength={8} />
                <ReadOnlyField icon={Briefcase} label="Cargo" value={user?.Cargo?.nombre} />
                {user?.numero_dependencia && <ReadOnlyField icon={Hash} label="N° Dependencia" value={user.numero_dependencia} />}
                {user?.numero_seccion && <ReadOnlyField icon={Layers} label="N° Sección" value={user.numero_seccion} />}
              </div>
            </div>
            {error && <InlineAlert type="error">{error}</InlineAlert>}
          </div>
        </div>
        <button className={styles.logoutBtn} style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background}} onClick={handleLogout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;