import {COLORS} from '../../constants';

const styles = {
  base: 'py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer transition-colors flex-1',
};

function Button({text, variant = 'primary', onClick, disabled}) {
  let backgroundColor = COLORS.primary;
  let color = COLORS.background;
  let border = 'none';

  if (variant === 'secondary') {
    backgroundColor = 'transparent';
    color = COLORS.background;
    border = `2px solid ${COLORS.background}`;
  }

  if (disabled) {
    backgroundColor = COLORS.fields;
  }

  return (
    <button className={styles.base} style={{backgroundColor, color, border, opacity: disabled ? 0.7 : 1}} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;