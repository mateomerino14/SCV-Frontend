import {CheckCircle2, Loader2, AlertTriangle, CalendarClock} from 'lucide-react';
import ExpenseField from '../atoms/ExpenseField';
import {formatDateShort} from '../../../utils/dateFormatter';
import {COLORS} from '../../../constants';

const styles = {
  box: 'flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs font-inter',
  rateValue: 'font-bold',
  input: 'w-full bg-transparent outline-none font-inter text-sm',
  manualWrap: 'flex flex-col gap-2',
};

const infoBoxes = {
  nodate: {icon: CalendarClock, text: 'Elige la fecha del gasto para obtener el tipo de cambio del día.'},
  loading: {icon: Loader2, text: 'Consultando el tipo de cambio del día...'},
};

function InstallmentRateField({currency, date, rateStatus, exchangeRate, rateMessage, error, disabled, onManualChange}) {
  if (rateStatus === 'ok') {
    return (
      <div className={styles.box} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.text}}>
        <CheckCircle2 size={14} style={{color: COLORS.success, flexShrink: 0, marginTop: 1}} />
        <p>
          Tipo de cambio del {formatDateShort(date)}: <span className={styles.rateValue}>1 USD = {parseFloat(exchangeRate).toFixed(4)} {currency}</span>
        </p>
      </div>
    );
  }
  if (rateStatus === 'manual') {
    return (
      <div className={styles.manualWrap}>
        <div className={styles.box} style={{backgroundColor: COLORS.error, color: COLORS.secondary}}>
          <AlertTriangle size={14} style={{flexShrink: 0, marginTop: 1}} />
          <p>No se pudo obtener el tipo de cambio del día. Ingrésalo manualmente; quedará marcado como ingresado a mano.</p>
        </div>
        <ExpenseField label={`Tipo de cambio (1 USD = cuántos ${currency})`} suffix={currency} error={error}>
          <input type="text" inputMode="decimal" placeholder="0.0000" disabled={disabled} className={styles.input} style={{color: COLORS.text}}
            value={exchangeRate} onChange={(event) => onManualChange(event.target.value)} />
        </ExpenseField>
      </div>
    );
  }
  if (rateStatus === 'error') {
    return (
      <div className={styles.box} style={{backgroundColor: COLORS.error, color: COLORS.secondary}}>
        <AlertTriangle size={14} style={{flexShrink: 0, marginTop: 1}} />
        <p>{rateMessage || 'No se pudo obtener el tipo de cambio de esta moneda.'}</p>
      </div>
    );
  }
  const info = infoBoxes[rateStatus] || infoBoxes.loading;
  const InfoIcon = info.icon;
  return (
    <div className={styles.box} style={{backgroundColor: COLORS.backgroundHeader, color: error ? COLORS.secondary : COLORS.labels}}>
      <InfoIcon size={14} className={rateStatus === 'loading' ? 'animate-spin' : ''} style={{flexShrink: 0, marginTop: 1}} />
      <p>{error || info.text}</p>
    </div>
  );
}

export default InstallmentRateField;
