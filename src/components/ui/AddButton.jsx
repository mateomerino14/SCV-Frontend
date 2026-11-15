import {Plus} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  button: 'flex items-center justify-center gap-2 w-full h-11 rounded-xl font-bold font-nunito text-sm cursor-pointer mb-4',
};

function AddButton({onClick, label, disabled = false}) {
  return (
    <button type="button" className={styles.button} onClick={onClick} disabled={disabled}
      style={{backgroundColor: COLORS.secondary, color: COLORS.background, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer'}}>
      <Plus size={18} />
      {label}
    </button>
  );
}

export default AddButton;
