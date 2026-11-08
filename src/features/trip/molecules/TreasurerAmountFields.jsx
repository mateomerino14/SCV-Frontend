import {Wallet, RotateCcw} from 'lucide-react';
import InputField from '../../../components/ui/InputField';
import {COLORS} from '../../../constants';

const styles = {
  card: 'flex flex-col gap-4 rounded-2xl border p-4',
  header: 'flex items-center gap-2',
  title: 'text-sm font-bold font-inter uppercase',
  hint: 'text-xs font-inter -mt-2',
  input: 'bg-transparent w-full outline-none font-inter text-sm',
  reset: 'flex items-center gap-1 text-xs font-bold font-inter cursor-pointer self-start',
};

function TreasurerAmountFields({amount, isInternational, errors = {}}) {
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.header}>
        <Wallet size={16} style={{color: COLORS.primary}} />
        <p className={styles.title} style={{color: COLORS.labels}}>Monto del viaje</p>
      </div>
      <p className={styles.hint} style={{color: COLORS.labels}}>
        El sistema lo calculó con la tarifa de tu cargo. Como tesorero puedes ajustarlo: es el fondo que se te asigna, porque la etapa de tesorería de tu propio viaje se aprueba sola.
      </p>
      <InputField label="Viáticos (Bs)" required error={errors.treasurerBs}>
        <input type="text" inputMode="decimal" className={styles.input} style={{color: COLORS.text}} value={amount.bsText}
          onChange={(event) => amount.setBsText(event.target.value)} aria-label="Viáticos en Bs" />
      </InputField>
      {isInternational && (
        <InputField label="Fondo internacional (USD)" required error={errors.treasurerUsd}>
          <input type="text" inputMode="decimal" className={styles.input} style={{color: COLORS.text}} value={amount.usdText}
            onChange={(event) => amount.setUsdText(event.target.value)} aria-label="Fondo internacional en USD" />
        </InputField>
      )}
      {amount.adjusted && (
        <button type="button" className={styles.reset} style={{color: COLORS.primary}} onClick={amount.resetToCalculated}>
          <RotateCcw size={13} /> Volver al monto calculado
        </button>
      )}
    </div>
  );
}

export default TreasurerAmountFields;
