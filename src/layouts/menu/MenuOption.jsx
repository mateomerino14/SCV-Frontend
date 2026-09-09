import {motion} from 'framer-motion';
import {COLORS} from '../../constants';

const styles = {
  option: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors',
  optionLabel: 'text-sm font-bold font-inter',
};

const itemVariants = {
  hidden: {opacity: 0, x: -12},
  visible: {opacity: 1, x: 0},
};

function MenuOption({label, icon: Icon, active, onClick}) {
  return (
    <motion.div variants={itemVariants} whileTap={{scale: 0.97}} whileHover={{backgroundColor: active ? COLORS.backgroundHeader : COLORS.element}}
      className={styles.option} style={{backgroundColor: active ? COLORS.backgroundHeader : 'transparent'}} onClick={onClick}>
      <Icon size={20} style={{color: active ? COLORS.primary : COLORS.labels}} />
      <p className={styles.optionLabel} style={{color: active ? COLORS.primary : COLORS.text}}>{label}</p>
    </motion.div>
  );
}

export default MenuOption;