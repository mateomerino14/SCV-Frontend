import {COLORS} from '../../constants';

const styles = {
  wrapper: 'flex flex-col gap-1',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  inputWrapper: 'flex items-center border rounded-xl px-4 py-3 gap-2',
  fieldError: 'text-xs font-inter mt-1',
};

function InputField({label, icon, error, children}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
      <div className={styles.inputWrapper} style={{borderColor: error ? '#f87171' : COLORS.dataFields}}>
        {icon}
        {children}
      </div>
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default InputField;