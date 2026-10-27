import {motion} from 'framer-motion';
import {COLORS} from '../../constants';
import useIsTreasurer from '../../hooks/user/useIsTreasurer';
import useMenuNavigation from '../../hooks/shared/useMenuNavigation';
import MenuOption from './MenuOption';
import MenuShell from './MenuShell';
import {avatarDefault} from '../../constants/defaultImages';

const styles = {
  header: 'flex items-center gap-3 px-4 py-[18px] shrink-0',
  avatar: 'w-[42px] h-[42px] rounded-full object-cover shrink-0',
  headerInfo: 'flex flex-col min-w-0',
  headerName: 'text-sm font-bold font-inter truncate',
  headerPosition: 'text-[11px] font-inter uppercase truncate',
  navScroll: 'flex-1 overflow-y-auto',
  nav: 'flex flex-col gap-2 p-2.5',
  group: 'flex flex-col gap-px p-1.5 rounded-xl',
  groupLabel: 'text-[10px] font-bold font-inter uppercase tracking-[.06em] px-2 pt-1 pb-0.5',
  logoutBtn: 'mx-2.5 mb-3 mt-1 h-10 rounded-[10px] border text-[13px] font-bold font-inter cursor-pointer shrink-0',
};

const listVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.04, delayChildren: 0.1}},
};

const fullNameOf = (user) => {
  if (user?.nombre && user?.apellido_paterno) {
    return `${user.nombre} ${user.apellido_paterno}`;
  }
  return 'Usuario';
};

function MenuLayout({isOpen, onClose, user, sections, exactMatchPaths}) {
  const {isTreasurer} = useIsTreasurer();
  const {isActive, handleNavigate, handleLogout} = useMenuNavigation(onClose, exactMatchPaths);
  const visibleSections = sections.filter((section) => !section.treasurerOnly || isTreasurer);

  return (
    <MenuShell isOpen={isOpen} onClose={onClose} backgroundColor={COLORS.background}>
      <div className={styles.header} style={{backgroundColor: COLORS.primary}}>
        <img src={user?.foto_perfil || avatarDefault} alt="avatar" className={styles.avatar} style={{border: `2px solid ${COLORS.background}`}} />
        <div className={styles.headerInfo}>
          <p className={styles.headerName} style={{color: COLORS.background}}>{fullNameOf(user)}</p>
          <p className={styles.headerPosition} style={{color: COLORS.onColorText80}}>{user?.Cargo?.nombre || ''}</p>
        </div>
      </div>
      <div className={styles.navScroll}>
        <motion.nav aria-label="Menú principal" className={styles.nav} variants={listVariants} initial="hidden" animate="visible">
          {visibleSections.map((section) => (
            <div key={section.label} className={styles.group} style={{backgroundColor: COLORS.menuGroup}}>
              <p className={styles.groupLabel} style={{color: COLORS.labels}}>{section.label}</p>
              {section.options.map(({path, label, icon}) => (
                <MenuOption key={path} label={label} icon={icon} active={isActive(path)} onClick={() => handleNavigate(path)} />
              ))}
            </div>
          ))}
        </motion.nav>
      </div>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}
        style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background}}>
        Cerrar Sesión
      </button>
    </MenuShell>
  );
}

export default MenuLayout;
