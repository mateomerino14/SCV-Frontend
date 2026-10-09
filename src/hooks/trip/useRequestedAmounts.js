import {useState, useCallback} from 'react';

const maxAmount = 999999.99;
const amountPattern = /^\d*\.?\d{0,2}$/;
const emptyAmounts = {requested: '', requestedUsd: '', lodging: '', lodgingUsd: ''};

const toNumber = (value) => parseFloat(value) || 0;
const roundAmount = (value) => parseFloat(value.toFixed(2));

function useRequestedAmounts({type, days, dailyRate, dailyRateUsd}) {
  const [amounts, setAmounts] = useState(emptyAmounts);
  const [amountErrors, setAmountErrors] = useState({});
  const isInternational = type === 'Internacional';

  const referenceBs = roundAmount(days * dailyRate);
  let referenceUsd = 0;
  let limitUsd = 0;
  if (isInternational) {
    referenceUsd = roundAmount(days * dailyRateUsd);
    limitUsd = roundAmount(referenceUsd + toNumber(amounts.lodgingUsd));
  }
  const limitBs = roundAmount(referenceBs + toNumber(amounts.lodging));

  const handleAmountChange = (field) => (value) => {
    if (value !== '' && (!amountPattern.test(value) || parseFloat(value) > maxAmount)) {
      return;
    }
    setAmounts((prev) => ({...prev, [field]: value}));
    setAmountErrors((prev) => ({...prev, [field]: undefined}));
  };

  const fillWithLimits = () => {
    const next = {...amounts, requested: limitBs.toFixed(2)};
    if (isInternational) {
      next.requestedUsd = limitUsd.toFixed(2);
    }
    setAmounts(next);
    setAmountErrors({});
  };

  const loadAmounts = useCallback((trip) => {
    setAmounts({
      requested: String(parseFloat(trip.monto_solicitado || trip.monto_asignado || 0)),
      requestedUsd: String(parseFloat(trip.monto_solicitado_usd || trip.monto_asignado_usd || 0)),
      lodging: String(parseFloat(trip.hospedaje_estimado || 0)),
      lodgingUsd: String(parseFloat(trip.hospedaje_estimado_usd || 0)),
    });
  }, []);

  const resetAmounts = () => {
    setAmounts(emptyAmounts);
    setAmountErrors({});
  };

  const validateAmounts = () => {
    const errors = {};
    const requested = toNumber(amounts.requested);
    let requestedUsd = 0;
    if (isInternational) {
      requestedUsd = toNumber(amounts.requestedUsd);
    }
    if (requested + requestedUsd <= 0) {
      errors.requested = 'Indica el monto que solicitas';
    }
    if (requested > limitBs) {
      errors.requested = `No puede superar el tope de ${limitBs.toFixed(2)} Bs`;
    }
    if (isInternational && requestedUsd > limitUsd) {
      errors.requestedUsd = `No puede superar el tope de ${limitUsd.toFixed(2)} USD`;
    }
    setAmountErrors(errors);
    return errors;
  };

  const buildAmountsPayload = () => {
    const payload = {
      monto_solicitado: roundAmount(toNumber(amounts.requested)),
      hospedaje_estimado: roundAmount(toNumber(amounts.lodging)),
      monto_solicitado_usd: 0,
      hospedaje_estimado_usd: 0,
    };
    if (isInternational) {
      payload.monto_solicitado_usd = roundAmount(toNumber(amounts.requestedUsd));
      payload.hospedaje_estimado_usd = roundAmount(toNumber(amounts.lodgingUsd));
    }
    return payload;
  };

  return {
    amounts, amountErrors, isInternational,
    referenceBs, referenceUsd, limitBs, limitUsd,
    handleAmountChange, fillWithLimits, loadAmounts, resetAmounts, validateAmounts, buildAmountsPayload,
  };
}

export default useRequestedAmounts;
