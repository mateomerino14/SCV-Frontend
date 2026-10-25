import InlineDropdown from '../../../components/ui/InlineDropdown';
import FieldLabel from '../../../components/ui/FieldLabel';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  fieldError: "text-xs font-inter mt-1",
};

function CurrencySelector({currencies, currency, onChange, error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const selectedCurrency = currencies.find((item) => item.codigo === currency);
  const options = currencies.map((item) => ({value: item.codigo, label: `${item.codigo} — ${item.nombre}`}));
  return (
    <div className={styles.wrapper}>
      <FieldLabel text="Moneda" required className={styles.label} />
      <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
        label={selectedCurrency ? `${selectedCurrency.codigo} — ${selectedCurrency.nombre}` : 'Seleccione una moneda'} options={options} selectedValue={currency}
        onSelect={(value) => {onChange(value); close();}} />
      {error && <p className={styles.fieldError} style={{color: COLORS.fieldError}}>{error}</p>}
    </div>
  );
}

export default CurrencySelector;