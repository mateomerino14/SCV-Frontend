import {COLORS} from '../../constants';

const styles = {
  option: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors',
  optionLabel: 'text-sm font-bold font-inter',
};

function MenuOption({label, icon: Icon, active, onClick}) {
  return (
    <div
      className={styles.option}
      style={{backgroundColor: active ? COLORS.backgroundHeader : 'transparent'}}
      onClick={onClick}
    >
      <Icon size={20} style={{color: active ? COLORS.primary : COLORS.labels}} />
      <p className={styles.optionLabel} style={{color: active ? COLORS.primary : COLORS.text}}>{label}</p>
    </div>
  );
}

export default MenuOption;