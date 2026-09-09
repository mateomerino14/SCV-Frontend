import {motion} from 'framer-motion';
import {COLORS} from '../../constants';

const styles = {
  base: 'py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer transition-colors flex-1 border-2',
};

function Button({text, variant = 'primary', onClick, disabled, type = 'button'}) {
  let backgroundColor = COLORS.secondary;
  let color = COLORS.background;
  let borderColor = COLORS.secondary;
  if (variant === 'secondary') {
    backgroundColor = COLORS.background;
    color = COLORS.primary;
    borderColor = COLORS.background;
  }
  if (disabled) {
    backgroundColor = COLORS.fields;
    borderColor = COLORS.fields;
    color = COLORS.labels;
  }
  return (
    <motion.button type={type} className={styles.base} style={{backgroundColor, color, borderColor, opacity: disabled ? 0.8 : 1}}
      onClick={onClick} disabled={disabled} whileTap={disabled ? {} : {scale: 0.96}} transition={{duration: 0.1}}>
      {text}
    </motion.button>
  );
}

export default Button;