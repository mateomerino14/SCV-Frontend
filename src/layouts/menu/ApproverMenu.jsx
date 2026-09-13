import {motion} from 'framer-motion';
import {ClipboardCheck, Briefcase, Plane, User, Settings, LogOut, Wallet, Wine} from 'lucide-react';
import {COLORS} from '../../constants';
import {routes} from '../../constants/routes';
import useIsTreasurer from '../../hooks/user/useIsTreasurer';
import useMenuNavigation from '../../hooks/shared/useMenuNavigation';
import MenuOption from './MenuOption';
import MenuShell, {listVariants} from './MenuShell';

const avatarDefault = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg";

const styles = {
  header: 'flex items-center gap-3 p-5 border-b shrink-0',
  avatar: 'w-12 h-12 rounded-full object-cover',
  headerInfo: 'flex flex-col flex-1',
  headerName: 'text-sm font-bold font-inter',
  headerPosition: 'text-xs font-inter uppercase',
  navScroll: 'flex-1 overflow-y-auto',
  nav: 'flex flex-col gap-1 p-4',
  section: 'flex flex-col gap-1 pb-1 mb-1 border-b',
  lastSection: 'flex flex-col gap-1',
  sectionLabel: 'text-xs font-bold font-inter uppercase px-4 pt-2 pb-1 opacity-60',
  logoutBtn: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mx-4 mb-4 shrink-0',
  logoutLabel: 'text-sm font-bold font-inter',
  finalDivider: 'border-t',
};

const approvalSection = [
  {path: routes.approverReviews, label: 'Revisiones Pendientes', icon: ClipboardCheck},
  {path: routes.approverAlcoholReviews, label: 'Revisión por Alcohol', icon: Wine},
];

const treasurySection = [
  {path: routes.treasurerReviews, label: 'Aprobación de Fondos', icon: Wallet},
];

const personalSection = [
  {path: routes.employeeDashboard, label: 'Viajes Personales', icon: Briefcase},
  {path: routes.employeeHistory, label: 'Mis Viajes', icon: Plane},
];

const accountSection = [
  {path: routes.approverProfile, label: 'Perfil', icon: User},
  {path: routes.approverSettings, label: 'Ajustes', icon: Settings},
];

function ApproverMenu({isOpen, onClose, user}) {
  const {isTreasurer} = useIsTreasurer();
  const {isActive, handleNavigate, handleLogout} = useMenuNavigation(onClose, [routes.employeeDashboard]);
  const renderOptions = (options) => options.map(({path, label, icon}) => (
    <MenuOption key={path} label={label} icon={icon} active={isActive(path)} onClick={() => handleNavigate(path)} />
  ));

  return (
    <MenuShell isOpen={isOpen} onClose={onClose} backgroundColor={COLORS.background}>
      <div className={styles.header} style={{borderColor: COLORS.dataFields}}>
        <img src={user?.foto_perfil || avatarDefault} alt="avatar" className={styles.avatar} style={{border: `2px solid ${COLORS.primary}`}} />
        <div className={styles.headerInfo}>
          <p className={styles.headerName} style={{color: COLORS.text}}>
            {user?.nombre && user?.apellido_paterno ? `${user.nombre} ${user.apellido_paterno}` : 'Usuario'}
          </p>
          <p className={styles.headerPosition} style={{color: COLORS.labels}}>{user?.Cargo?.nombre || ''}</p>
        </div>
      </div>
      <div className={styles.navScroll}>
        <motion.div className={styles.nav} variants={listVariants} initial="hidden" animate="visible">
          <div className={styles.section} style={{borderColor: COLORS.dataFields}}>
            <p className={styles.sectionLabel} style={{color: COLORS.labels}}>Aprobación de Viajes</p>
            {renderOptions(approvalSection)}
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
        </motion.div>
      </div>
      <div className={styles.finalDivider} style={{borderColor: COLORS.dataFields}} />
      <div className={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={20} style={{color: COLORS.secondary}} />
        <p className={styles.logoutLabel} style={{color: COLORS.secondary}}>Cerrar Sesión</p>
      </div>
    </MenuShell>
  );
}

export default ApproverMenu;