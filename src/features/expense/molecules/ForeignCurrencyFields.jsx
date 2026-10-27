import {Globe} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import CurrencySelector from './CurrencySelector';
import {convertForeignAmount, usdCurrency} from '../../../utils/expenseCurrency';

const styles = {
  card: 'rounded-2xl border p-5 flex flex-col gap-4',
  titleRow: 'flex items-center gap-2.5',
  iconBox: 'w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0',
  title: 'text-[15px] font-bold font-inter',
  note: 'text-xs font-inter -mt-1',
  rates: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
  input: 'w-full bg-transparent outline-none font-inter text-sm',
  summary: 'grid grid-cols-2 border-t pt-3',
  summaryCell: 'flex flex-col gap-0.5',
  summaryLabel: 'text-[11px] font-inter',
  summaryValue: 'text-lg font-bold font-inter',
};

function ConversionValue({label, value, suffix, divided}) {
  let text = '—';
  if (value !== null) {
    text = `${value.toFixed(2)} ${suffix}`;
  }
  let dividerStyle = {};
  if (divided) {
    dividerStyle = {borderLeft: `1px solid ${COLORS.dataFields}`, paddingLeft: 14};
  }
  return (
    <div className={styles.summaryCell} style={dividerStyle}>
      <span className={styles.summaryLabel} style={{color: COLORS.labels}}>{label}</span>
      <span className={styles.summaryValue} style={{color: COLORS.primary}}>{text}</span>
    </div>
  );
}

function ForeignCurrencyFields({currencies, currency, exchangeRate, bsRate, amount, errors = {}, disabled, onCurrencyChange, onExchangeRateChange, onBsRateChange}) {
  const {usd, bs} = convertForeignAmount(amount, currency, exchangeRate, bsRate);
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.titleRow}>
        <span className={styles.iconBox} style={{backgroundColor: COLORS.primarySoft}}>
          <Globe size={16} style={{color: COLORS.primary}} />
        </span>
        <span className={styles.title} style={{color: COLORS.text}}>Moneda y tipo de cambio</span>
      </div>
      <p className={styles.note} style={{color: COLORS.labels}}>Escribe el monto en la moneda de la factura. El sistema lo pasa a dólares y a bolivianos con tus tipos de cambio.</p>
      <CurrencySelector currencies={currencies} currency={currency} onChange={onCurrencyChange} />
      <div className={styles.rates}>
        {currency !== usdCurrency && (
          <ExpenseField label={`1 USD = ? ${currency}`} required suffix={currency} error={errors.exchangeRate}>
            <input type="text" inputMode="decimal" placeholder="0.0000" disabled={disabled} className={styles.input} style={{color: COLORS.text}}
              aria-label={`Tipo de cambio: cuántos ${currency} vale 1 USD`} value={exchangeRate} onChange={(event) => onExchangeRateChange(event.target.value)} />
          </ExpenseField>
        )}
        <ExpenseField label="1 USD = ? Bs" required suffix="Bs" error={errors.bsRate}>
          <input type="text" inputMode="decimal" placeholder="6.9600" disabled={disabled} className={styles.input} style={{color: COLORS.text}}
            aria-label="Tipo de cambio: cuántos Bs vale 1 USD" value={bsRate} onChange={(event) => onBsRateChange(event.target.value)} />
        </ExpenseField>
      </div>
      <div className={styles.summary} style={{borderColor: COLORS.dataFields}}>
        <ConversionValue label="En dólares" value={usd} suffix="USD" />
        <ConversionValue label="En bolivianos" value={bs} suffix="Bs" divided />
      </div>
    </div>
  );
}

export default ForeignCurrencyFields;
