import {Hotel, Wallet} from 'lucide-react';
import TripAmountInput from '../atoms/TripAmountInput';
import RequestLimitSummary from '../atoms/RequestLimitSummary';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: 'flex flex-col gap-4',
  title: 'text-xs font-bold font-inter uppercase',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  fillBtn: 'text-xs font-bold font-nunito cursor-pointer underline w-fit',
};

function RequestedAmountFields({
  isInternational, days, dailyRate, dailyRateUsd, amounts, amountErrors,
  referenceBs, referenceUsd, limitBs, limitUsd, onAmountChange, onFillWithLimits,
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title} style={{color: COLORS.labels}}>Monto a Solicitar</p>
      <div className={styles.grid}>
        <TripAmountInput label="Hospedaje estimado (Bs)" icon={Hotel} value={amounts.lodging} currency="Bs" onChange={onAmountChange('lodging')} />
        {isInternational && (
          <TripAmountInput label="Hospedaje estimado (USD)" icon={Hotel} value={amounts.lodgingUsd} currency="USD" onChange={onAmountChange('lodgingUsd')} />
        )}
      </div>
      {days > 0 && (
        <div className={styles.grid}>
          <RequestLimitSummary days={days} dailyRate={dailyRate} reference={referenceBs} lodging={amounts.lodging} limit={limitBs} currency="Bs" />
          {isInternational && (
            <RequestLimitSummary days={days} dailyRate={dailyRateUsd} reference={referenceUsd} lodging={amounts.lodgingUsd} limit={limitUsd} currency="USD" />
          )}
        </div>
      )}
      <div className={styles.grid}>
        <TripAmountInput label="Monto solicitado (Bs)" icon={Wallet} value={amounts.requested} currency="Bs" error={amountErrors.requested}
          onChange={onAmountChange('requested')} />
        {isInternational && (
          <TripAmountInput label="Monto solicitado (USD)" icon={Wallet} value={amounts.requestedUsd} currency="USD" error={amountErrors.requestedUsd}
            onChange={onAmountChange('requestedUsd')} />
        )}
      </div>
      {days > 0 && (
        <button type="button" className={styles.fillBtn} style={{color: COLORS.primary}} onClick={onFillWithLimits}>
          Solicitar el tope completo
        </button>
      )}
    </div>
  );
}

export default RequestedAmountFields;
