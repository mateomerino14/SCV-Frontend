import {COLORS} from '../../../constants';
import FieldLabel from '../../../components/ui/FieldLabel';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  inputBox: "rounded-xl px-4 py-3 border w-full",
  inputRow: "flex items-center gap-2",
  suffix: "text-sm font-bold font-inter",
  fieldError: "text-xs font-inter mt-1",
};

function ExpenseField({label, required = false, children, suffix, error}) {
  return (
    <div className={styles.wrapper}>
      <FieldLabel text={label} required={required} className={styles.label} />
      <div className={styles.inputBox} style={{borderColor: error ? COLORS.fieldErrorBorder : COLORS.dataFields, borderWidth: error ? '1.5px' : '1px'}}>
        <div className={styles.inputRow}>
          {children}
          {suffix && <span className={styles.suffix} style={{color: COLORS.labels}}>{suffix}</span>}
        </div>
      </div>
      {error && <p className={styles.fieldError} style={{color: COLORS.fieldError}}>{error}</p>}
    </div>
  );
}

export default ExpenseField;