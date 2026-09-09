import {COLORS} from '../../../constants';

const styles = {
  hint: 'text-xs font-inter mt-0.5',
};

function PasswordMatchHint({matches}) {
  const color = matches ? '#2d7a3a' : COLORS.secondary;
  const text = matches ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden';
  return <p className={styles.hint} style={{color}}>{text}</p>;
}

export default PasswordMatchHint;