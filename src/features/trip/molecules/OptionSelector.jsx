import FieldLabel from '../../../components/ui/FieldLabel';
import {COLORS} from '../../../constants';

const styles = {
  group: 'flex flex-col gap-2',
  label: 'text-xs font-bold font-inter uppercase mb-1',
  buttons: 'flex gap-2 flex-wrap',
  button: 'flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer font-inter text-sm font-bold transition-colors',
  hint: 'text-[11px] font-inter',
};

function OptionSelector({label, options, value, onChange, required = false, hint}) {
  return (
    <div className={styles.group} role="radiogroup" aria-label={label}>
      <FieldLabel text={label} required={required} className={styles.label} />
      <div className={styles.buttons}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button key={option.value} type="button" role="radio" aria-checked={selected} className={styles.button} onClick={() => onChange(option.value)}
              style={{backgroundColor: selected ? COLORS.primary : COLORS.dataFields, borderColor: selected ? COLORS.primary : COLORS.fields, color: selected ? COLORS.background : COLORS.labels}}>
              {option.label}
            </button>
          );
        })}
      </div>
      {hint && <p className={styles.hint} style={{color: COLORS.labels}}>{hint}</p>}
    </div>
  );
}

export default OptionSelector;
