import {Menu} from 'lucide-react';
import {COLORS} from '../constants';
import {avatarDefault} from '../constants/defaultImages';


const styles = {
  navbar: "flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10",
  title: "font-bold font-inter text-lg",
};

function Navbar({text, onMenuClick, profilePhoto}) {
  return (
    <nav className={styles.navbar} style={{backgroundColor: COLORS.backgroundHeader, borderColor: COLORS.dataFields}}>
      <div className="flex items-center gap-3">
        <Menu
          size={22}
          strokeWidth={3}
          className="cursor-pointer"
          style={{color: COLORS.title}}
          onClick={onMenuClick}
        />
        <span className={styles.title} style={{color: COLORS.title}}>{text}</span>
      </div>
      <img
        src={profilePhoto || avatarDefault}
        alt="avatar"
        className="w-11 h-11 rounded-full object-cover"
      />
    </nav>
  );
}

export default Navbar;