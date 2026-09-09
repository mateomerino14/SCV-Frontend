import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {KeyRound, FileText, LogOut} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ConfigOption from '../../features/user/atoms/ConfigOption';
import ChangePasswordModal from '../../features/user/organisms/ChangePasswordModal';
import TermsModal from '../../features/user/organisms/TermsModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  titleWrapper: "mb-6",
  title: "text-3xl font-bold font-inter mb-1",
  subtitle: "text-sm font-inter",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
  sectionCard: "rounded-2xl p-6 shadow-sm border",
  sectionLabel: "text-sm font-bold font-inter uppercase mb-4",
  sectionWrapper: "flex flex-col gap-3",
  logoutBtn: "w-full py-3.5 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 flex items-center justify-center gap-2 transition-colors",
};

function SettingsPage() {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(routes.login);
  };

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Configuración" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />

      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title} style={{color: COLORS.text}}>Ajustes de Cuenta</h1>
          <p className={styles.subtitle} style={{color: COLORS.labels}}>Gestiona tu contraseña y revisa los términos del sistema.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.sectionCard} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
            <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Cuenta</p>
            <div className={styles.sectionWrapper}>
              <ConfigOption icon={KeyRound} label="Cambiar contraseña" onClick={() => setShowChangePassword(true)} />
            </div>
          </div>

          <div className={styles.sectionCard} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
            <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Soporte</p>
            <div className={styles.sectionWrapper}>
              <ConfigOption icon={FileText} label="Términos y condiciones" onClick={() => setShowTerms(true)} />
            </div>
          </div>
        </div>

        <button className={styles.logoutBtn} style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background}} onClick={handleLogout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      <Footer />
    </div>
  );
}

export default SettingsPage;