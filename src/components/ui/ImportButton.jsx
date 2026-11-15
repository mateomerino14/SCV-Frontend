import {COLORS} from '../../constants';

const styles = {
  button: 'flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold font-nunito text-sm cursor-pointer mb-4 border-2',
};

function ImportButton({onClick, disabled = false, label = 'Importar desde Excel'}) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}
      style={{borderColor: COLORS.secondary, color: COLORS.secondary, backgroundColor: COLORS.background, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer'}}>
      {label}
    </button>
  );
}

export default ImportButton;
