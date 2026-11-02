import {Globe} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import CurrencySelector from './CurrencySelector';
import {convertForeignAmount, usdCurrency, bsCurrency, bothCurrencies, renditionModes, needsUsdRate, needsBsRate} from '../../../utils/expenseCurrency';

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
  renditionRow: 'flex flex-col gap-2',
  renditionLabel: 'text-xs font-bold font-inter uppercase',
  renditionButtons: 'flex gap-2 flex-wrap',
  renditionButton: 'px-3 py-2 rounded-xl border cursor-pointer font-inter text-sm font-bold transition-colors',
};

const modeNotes = {
  USD: 'El gasto sale en USD en la planilla y en Oracle. Escribe cuántos {currency} vale 1 USD.',
  BOB: 'El gasto sale en Bs en la planilla y en Oracle. Escribe cuántos Bs te costó cada {currency}.',
  AMBOS: 'Escribe los dos tipos de cambio: el gasto se guarda en USD y en Bs, y se rinde en la moneda del fondo de tu viaje.',
};

const bsFundNote = 'Tu viaje recibió todo en Bs: también se pide el tipo de cambio a Bs para descontarlo de ese fondo.';

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

function RateField({label, suffix, error, disabled, ariaLabel, placeholder = '0.0000', value, onChange}) {
  return (
    <ExpenseField label={label} required suffix={suffix} error={error}>
      <input type="text" inputMode="decimal" placeholder={placeholder} disabled={disabled} className={styles.input} style={{color: COLORS.text}}
        aria-label={ariaLabel} value={value} onChange={(event) => onChange(event.target.value)} />
    </ExpenseField>
  );
}

function ForeignCurrencyFields({currencies, currency, exchangeRate, bsRate, amount, errors = {}, disabled, onCurrencyChange, onExchangeRateChange, onBsRateChange, renditionMode = bothCurrencies, onRenditionModeChange, tripHasUsdFund = true}) {
  const {usd, bs} = convertForeignAmount(amount, currency, exchangeRate, bsRate, renditionMode);
  const askBsRate = needsBsRate(renditionMode, tripHasUsdFund);
  const showsUsd = renditionMode !== bsCurrency;
  const showsBs = renditionMode === bsCurrency || askBsRate;
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.titleRow}>
        <span className={styles.iconBox} style={{backgroundColor: COLORS.primarySoft}}>
          <Globe size={16} style={{color: COLORS.primary}} />
        </span>
        <span className={styles.title} style={{color: COLORS.text}}>Moneda y tipo de cambio</span>
      </div>
      <CurrencySelector currencies={currencies} currency={currency} onChange={onCurrencyChange} />
      {onRenditionModeChange && (
        <div className={styles.renditionRow} role="radiogroup" aria-label="Rendir el gasto en">
          <span className={styles.renditionLabel} style={{color: COLORS.labels}}>Rendir el gasto en</span>
          <div className={styles.renditionButtons}>
            {renditionModes.map((option) => (
              <button key={option.value} type="button" role="radio" aria-checked={renditionMode === option.value} disabled={disabled}
                className={styles.renditionButton} onClick={() => onRenditionModeChange(option.value)}
                style={{backgroundColor: renditionMode === option.value ? COLORS.primary : COLORS.dataFields, borderColor: renditionMode === option.value ? COLORS.primary : COLORS.fields, color: renditionMode === option.value ? COLORS.background : COLORS.labels}}>
                {option.label}
              </button>
            ))}
          </div>
          <p className={styles.note} style={{color: COLORS.labels}}>{modeNotes[renditionMode].replace('{currency}', currency)}</p>
          {renditionMode === usdCurrency && askBsRate && <p className={styles.note} style={{color: COLORS.labels}}>{bsFundNote}</p>}
        </div>
      )}
      <div className={styles.rates}>
        {renditionMode === bsCurrency && (
          <RateField label={`1 ${currency} = ? Bs`} suffix="Bs" error={errors.exchangeRate} disabled={disabled}
            ariaLabel={`Tipo de cambio: cuántos Bs vale 1 ${currency}`} value={exchangeRate} onChange={onExchangeRateChange} />
        )}
        {needsUsdRate(renditionMode, currency) && (
          <RateField label={`1 USD = ? ${currency}`} suffix={currency} error={errors.exchangeRate} disabled={disabled}
            ariaLabel={`Tipo de cambio: cuántos ${currency} vale 1 USD`} value={exchangeRate} onChange={onExchangeRateChange} />
        )}
        {askBsRate && (
          <RateField label="1 USD = ? Bs" suffix="Bs" error={errors.bsRate} disabled={disabled} placeholder="6.9600"
            ariaLabel="Tipo de cambio: cuántos Bs vale 1 USD" value={bsRate} onChange={onBsRateChange} />
        )}
      </div>
      <div className={styles.summary} style={{borderColor: COLORS.dataFields}}>
        {showsUsd && <ConversionValue label="En dólares" value={usd} suffix="USD" />}
        {showsBs && <ConversionValue label="En bolivianos" value={bs} suffix="Bs" divided={showsUsd} />}
      </div>
    </div>
  );
}

export default ForeignCurrencyFields;
