import InputField from '../../../components/ui/InputField';
import {COLORS} from '../../../constants';

const styles = {
  input: 'bg-transparent w-full outline-none font-inter text-sm',
  suffix: 'text-xs font-bold font-inter',
};

function TripAmountInput({label, icon: Icon, value, currency, error, onChange}) {
  return (
    <InputField label={label} error={error} icon={<Icon size={16} style={{color: COLORS.labels}} />}>
      <input type="text" inputMode="decimal" placeholder="0.00" className={styles.input} style={{color: COLORS.text}}
        value={value} onChange={(event) => onChange(event.target.value)} />
      <span className={styles.suffix} style={{color: COLORS.labels}}>{currency}</span>
    </InputField>
  );
}

export default TripAmountInput;
