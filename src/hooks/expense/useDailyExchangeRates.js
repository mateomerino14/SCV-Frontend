import {useState, useRef, useCallback} from 'react';
import {getDailyExchangeRate} from '../../services/expense/expenseService';

const rateKey = (date, currency) => `${date}|${currency}`;

const rateErrors = {
  nodate: 'Elige la fecha del gasto para obtener el tipo de cambio',
  loading: 'Espera a que se cargue el tipo de cambio del día',
};

export const installmentRateError = (installment) => {
  if (rateErrors[installment.rateStatus]) {
    return rateErrors[installment.rateStatus];
  }
  if (installment.rateStatus === 'error') {
    return installment.rateMessage || 'No se pudo obtener el tipo de cambio';
  }
  if (installment.rateStatus === 'manual' && !(parseFloat(installment.exchangeRate) > 0)) {
    return 'Ingresa el tipo de cambio del día';
  }
  return null;
};

function useDailyExchangeRates() {
  const [rates, setRates] = useState({});
  const requestedRef = useRef(new Set());

  const requestRate = useCallback(async (date, currency) => {
    if (!date || !currency) {
      return;
    }
    const key = rateKey(date, currency);
    if (requestedRef.current.has(key)) {
      return;
    }
    requestedRef.current.add(key);
    setRates((prev) => ({...prev, [key]: {status: 'loading'}}));
    const result = await getDailyExchangeRate(date, currency);
    if (result.error) {
      let status = 'error';
      if (result.permiteManual) {
        status = 'manual';
      }
      setRates((prev) => ({...prev, [key]: {status, message: result.error}}));
      return;
    }
    setRates((prev) => ({...prev, [key]: {status: 'ok', tasa: parseFloat(result.tasa)}}));
  }, []);

  const requestRates = useCallback((date, installments) => {
    installments.forEach((installment) => requestRate(date, installment.currency));
  }, [requestRate]);

  const rateOf = useCallback((date, currency) => {
    if (!date) {
      return {status: 'nodate'};
    }
    return rates[rateKey(date, currency)] || {status: 'loading'};
  }, [rates]);

  const applyRates = useCallback((date, installments) => installments.map((installment) => {
    const rate = rateOf(date, installment.currency);
    if (rate.status === 'ok') {
      return {...installment, exchangeRate: String(rate.tasa), rateStatus: 'ok'};
    }
    let exchangeRate = '';
    if (rate.status === 'manual') {
      exchangeRate = installment.exchangeRate;
    }
    return {...installment, exchangeRate, rateStatus: rate.status, rateMessage: rate.message};
  }), [rateOf]);

  return {requestRates, applyRates};
}

export default useDailyExchangeRates;
