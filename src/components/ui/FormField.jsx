import {COLORS} from '../../constants';

const styles = {
  wrapper: 'min-w-0',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  inputWrapper: 'flex items-center border rounded-xl px-3 py-2.5 gap-2',
  input: 'w-full min-w-0 bg-transparent outline-none font-inter text-sm',
  fieldError: 'text-xs font-inter mt-1',
  helperText: 'text-xs font-inter mt-1',
};

function FormField({label, value, onChange, onKeyDown, onBlur, error, helperText, type = 'text', inputMode, placeholder, maxLength, disabled}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
      <div className={styles.inputWrapper} style={{borderColor: error ? '#f87171' : COLORS.dataFields, backgroundColor: COLORS.background}}>
        <input className={styles.input} style={{color: COLORS.text}} type={type} inputMode={inputMode} placeholder={placeholder} maxLength={maxLength}
          value={value || ''} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} disabled={disabled} autoComplete="off" />
      </div>
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
      {!error && helperText && <p className={styles.helperText} style={{color: COLORS.secondary}}>{helperText}</p>}
    </div>
  );
}

export default FormField;