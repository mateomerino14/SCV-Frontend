import {LayoutDashboard, Users, Briefcase, Plane, User, Settings, LogOut, X, Wallet} from 'lucide-react';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';
import useIsTreasurer from '../../hooks/user/useIsTreasurer';
import useMenuNavigation from '../../hooks/shared/useMenuNavigation';
import MenuOption from './MenuOption';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  overlay: 'fixed inset-0 z-50',
  backdrop: 'absolute inset-0',
  drawer: 'absolute top-0 left-0 h-screen w-72 flex flex-col shadow-2xl',
  header: 'flex items-center gap-3 p-4 border-b shrink-0',
  avatar: 'w-11 h-11 rounded-full object-cover border-2',
  headerInfo: 'flex flex-col flex-1',
  headerName: 'text-sm font-bold font-inter',
  headerPosition: 'text-xs font-inter uppercase',
  closeBtn: 'cursor-pointer shrink-0',
  navScroll: 'flex-1 overflow-y-auto',
  nav: 'flex flex-col gap-1 px-3 py-2',
  section: 'flex flex-col gap-1 pb-1.5 mb-1.5 border-b',
  lastSection: 'flex flex-col gap-1',
  sectionLabel: 'text-xs font-bold font-inter uppercase px-3 pt-2 pb-1 opacity-60',
  logoutBtn: 'flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer mx-4 mb-3 shrink-0',
  logoutLabel: 'text-sm font-bold font-inter',
  finalDivider: 'border-t',
};

const administrationSection = [
  {path: routes.adminDashboard, label: 'Dashboard', icon: LayoutDashboard},
  {path: routes.adminUsers, label: 'Usuarios', icon: Users},
  {path: routes.adminPositions, label: 'Cargos', icon: Briefcase},
];

const treasurySection = [
  {path: routes.treasurerReviews, label: 'Aprobación de Fondos', icon: Wallet},
];

const personalSection = [
  {path: routes.employeeDashboard, label: 'Viajes Personales', icon: Plane},
  {path: routes.employeeHistory, label: 'Mis Viajes', icon: Plane},
];

const accountSection = [
  {path: routes.adminProfile, label: 'Perfil', icon: User},
  {path: routes.adminSettings, label: 'Ajustes', icon: Settings},
];

function AdminMenu({isOpen, onClose, user}) {
  const {isTreasurer} = useIsTreasurer();
  const {isActive, handleNavigate, handleLogout} = useMenuNavigation(onClose, [routes.adminDashboard, routes.employeeDashboard]);

  if (!isOpen) {
    return null;
  }

  const renderOptions = (options) => options.map(({path, label, icon}) => (
    <MenuOption
      key={path}
      label={label}
      icon={icon}
      active={isActive(path)}
      onClick={() => handleNavigate(path)}
    />
  ));

  return (
    <div className={styles.overlay}>
      <div
        className={styles.backdrop}
        style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
        onClick={onClose}
      />
      <div className={styles.drawer} style={{backgroundColor: COLORS.background}}>
        <div className={styles.header} style={{borderColor: COLORS.dataFields}}>
          <img
            src={user?.foto_perfil || avatarDefault}
            alt="avatar"
            className={styles.avatar}
            style={{borderColor: COLORS.primary}}
          />
          <div className={styles.headerInfo}>
            <p className={styles.headerName} style={{color: COLORS.text}}>
              {user?.nombre && user?.apellido_paterno
                ? `${user.nombre} ${user.apellido_paterno}`
                : 'Usuario'}
            </p>
            <p className={styles.headerPosition} style={{color: COLORS.labels}}>
              {user?.Cargo?.nombre || ''}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} style={{color: COLORS.labels}} />
          </button>
        </div>

        <div className={styles.navScroll}>
          <div className={styles.nav}>
            <div className={styles.section} style={{borderColor: COLORS.dataFields}}>
              <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Administración</p>
              {renderOptions(administrationSection)}
            </div>

            {isTreasurer && (
              <div className={styles.section} style={{borderColor: COLORS.dataFields}}>
                <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Aprobación de Fondos</p>
                {renderOptions(treasurySection)}
              </div>
            )}

            <div className={styles.section} style={{borderColor: COLORS.dataFields}}>
              <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Mis Viajes</p>
              {renderOptions(personalSection)}
            </div>

            <div className={styles.lastSection}>
              <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Cuenta</p>
              {renderOptions(accountSection)}
            </div>
          </div>
        </div>

        <div className={styles.finalDivider} style={{borderColor: COLORS.dataFields}} />

        <div className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} style={{color: COLORS.secondary}} />
          <p className={styles.logoutLabel} style={{color: COLORS.secondary}}>Cerrar Sesión</p>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;