import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  inputBox: "rounded-xl px-4 py-3 border w-full",
  inputRow: "flex items-center gap-2",
  suffix: "text-sm font-bold font-inter",
  fieldError: "text-xs font-inter mt-1",
};

function ExpenseField({label, children, suffix, error}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>{label}</p>
      <div className={styles.inputBox} style={{borderColor: error ? '#f87171' : COLORS.dataFields, borderWidth: error ? '1.5px' : '1px'}}>
        <div className={styles.inputRow}>
          {children}
          {suffix && <span className={styles.suffix} style={{color: COLORS.labels}}>{suffix}</span>}
        </div>
      </div>
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default ExpenseField;