import {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {COLORS} from '../../constants';

const styles = {
  label: 'text-xs font-bold font-inter uppercase mb-1',
  inputRow: 'flex items-center border rounded-xl px-4 py-3 gap-2',
  input: 'flex-1 outline-none font-inter text-sm',
  helperText: 'text-xs font-inter mt-0.5',
};

function PasswordField({label, value, onChange, maxLength, borderColor, labelColor, textColor, backgroundColor, iconColor}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <p className={styles.label} style={{color: labelColor || COLORS.labels}}>{label}</p>
      <div className={styles.inputRow} style={{borderColor: borderColor || COLORS.dataFields, backgroundColor: backgroundColor || 'transparent'}}>
        <input className={styles.input} style={{color: textColor || COLORS.text, backgroundColor: 'transparent'}} type={visible ? 'text' : 'password'}
          value={value} maxLength={maxLength} onChange={onChange} />
        <button type="button" onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={16} style={{color: iconColor || COLORS.labels}} /> : <Eye size={16} style={{color: iconColor || COLORS.labels}} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;