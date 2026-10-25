import {COLORS} from '../../constants';
import FieldLabel from './FieldLabel';

const styles = {
  wrapper: 'flex flex-col gap-1',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  inputWrapper: 'flex border rounded-xl px-4 py-3 gap-2',
  fieldError: 'text-xs font-inter mt-1',
};

function InputField({label, required = false, icon, error, alignTop = false, children}) {
  return (
    <div className={styles.wrapper}>
      <FieldLabel text={label} required={required} className={styles.label} />
      <div className={`${styles.inputWrapper} ${alignTop ? 'items-start' : 'items-center'}`} style={{borderColor: error ? '#f87171' : COLORS.dataFields}}>
        {icon && <span className={`flex shrink-0 ${alignTop ? 'mt-0.5' : ''}`}>{icon}</span>}
        {children}
      </div>
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default InputField;