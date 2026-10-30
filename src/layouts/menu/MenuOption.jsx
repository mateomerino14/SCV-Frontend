import {motion} from 'framer-motion';
import {COLORS} from '../../constants';

const styles = {
  option: 'flex items-center gap-2.5 px-2.5 py-2 [@media(max-height:700px)]:py-1.5 rounded-[9px] cursor-pointer transition-colors',
  optionLabel: 'text-[13px] font-semibold font-inter',
};

const itemVariants = {
  hidden: {opacity: 0, x: -12},
  visible: {opacity: 1, x: 0},
};

function MenuOption({label, icon: Icon, active, onClick}) {
  let backgroundColor = 'transparent';
  let hoverColor = COLORS.element;
  let textColor = COLORS.text;
  let iconColor = COLORS.labels;
  if (active) {
    backgroundColor = COLORS.primary;
    hoverColor = COLORS.primary;
    textColor = COLORS.background;
    iconColor = COLORS.background;
  }
  return (
    <motion.div variants={itemVariants} whileTap={{scale: 0.97}} whileHover={{backgroundColor: hoverColor}}
      className={styles.option} style={{backgroundColor}} onClick={onClick} role="link" aria-current={active ? 'page' : undefined}>
      <Icon size={16} style={{color: iconColor}} />
      <p className={styles.optionLabel} style={{color: textColor}}>{label}</p>
    </motion.div>
  );
}

export default MenuOption;
