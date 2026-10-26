import {Globe} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import CurrencySelector from './CurrencySelector';
import {convertForeignAmount, usdCurrency} from '../../../utils/expenseCurrency';

const styles = {
  card: "rounded-xl border p-4 flex flex-col gap-3",
  titleRow: "flex items-center gap-2",
  title: "text-sm font-bold font-inter",
  note: "text-xs font-inter italic",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  summary: "grid grid-cols-2 gap-2",
  summaryBox: "rounded-xl px-3 py-2 text-center",
  summaryLabel: "text-[11px] font-inter uppercase",
  summaryValue: "text-lg font-bold font-inter",
};

function ConversionBox({label, value, suffix}) {
  let text = '—';
  if (value !== null) {
    text = `${value.toFixed(2)} ${suffix}`;
  }
  return (
    <div className={styles.summaryBox} style={{backgroundColor: COLORS.background}}>
      <p className={styles.summaryLabel} style={{color: COLORS.labels}}>{label}</p>
      <p className={styles.summaryValue} style={{color: COLORS.primary}}>{text}</p>
    </div>
  );
}

function ForeignCurrencyFields({currencies, currency, exchangeRate, bsRate, amount, errors = {}, disabled, onCurrencyChange, onExchangeRateChange, onBsRateChange}) {
  const {usd, bs} = convertForeignAmount(amount, currency, exchangeRate, bsRate);
  return (
    <div className={styles.card} style={{borderColor: COLORS.primary, backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.titleRow}>
        <Globe size={16} style={{color: COLORS.primary}} />
        <span className={styles.title} style={{color: COLORS.text}}>Moneda y tipo de cambio</span>
      </div>
      <p className={styles.note} style={{color: COLORS.labels}}>Escribe el monto en la moneda de la factura. El sistema lo pasa a dólares y a bolivianos con tus tipos de cambio.</p>
      <CurrencySelector currencies={currencies} currency={currency} onChange={onCurrencyChange} />
      {currency !== usdCurrency && (
        <ExpenseField label={`Tipo de cambio (1 USD = cuántos ${currency})`} required suffix={currency} error={errors.exchangeRate}>
          <input type="text" inputMode="decimal" placeholder="0.0000" disabled={disabled} className={styles.input} style={{color: COLORS.text}}
            value={exchangeRate} onChange={(event) => onExchangeRateChange(event.target.value)} />
        </ExpenseField>
      )}
      <ExpenseField label="Tipo de cambio a bolivianos (1 USD = cuántos Bs)" required suffix="Bs" error={errors.bsRate}>
        <input type="text" inputMode="decimal" placeholder="6.9600" disabled={disabled} className={styles.input} style={{color: COLORS.text}}
          value={bsRate} onChange={(event) => onBsRateChange(event.target.value)} />
      </ExpenseField>
      <div className={styles.summary}>
        <ConversionBox label="En dólares" value={usd} suffix="USD" />
        <ConversionBox label="En bolivianos" value={bs} suffix="Bs" />
      </div>
    </div>
  );
}

export default ForeignCurrencyFields;
