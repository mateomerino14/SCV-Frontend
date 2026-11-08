import {useState} from 'react';
import useIsTreasurer from '../user/useIsTreasurer';

const amountPattern = /^\d+(\.\d{0,2})?$/;

const amountOf = (text) => parseFloat(String(text).replace(',', '.'));

const isValidAmount = (text) => amountPattern.test(String(text).replace(',', '.'));

function useTreasurerTripAmount(calculatedBs, calculatedUsd) {
  const {isTreasurer} = useIsTreasurer();
  const [customBs, setCustomBs] = useState(null);
  const [customUsd, setCustomUsd] = useState(null);

  let bsText = calculatedBs.toFixed(2);
  if (customBs !== null) {
    bsText = customBs;
  }
  let usdText = calculatedUsd.toFixed(2);
  if (customUsd !== null) {
    usdText = customUsd;
  }

  let finalBs = calculatedBs;
  let finalUsd = calculatedUsd;
  if (isTreasurer && isValidAmount(bsText)) {
    finalBs = amountOf(bsText);
  }
  if (isTreasurer && isValidAmount(usdText)) {
    finalUsd = amountOf(usdText);
  }
  const adjusted = isTreasurer && (finalBs !== calculatedBs || finalUsd !== calculatedUsd);

  const resetToCalculated = () => {
    setCustomBs(null);
    setCustomUsd(null);
  };

  const loadSaved = (savedBs, savedUsd) => {
    setCustomBs(Number(savedBs || 0).toFixed(2));
    setCustomUsd(Number(savedUsd || 0).toFixed(2));
  };

  const validateAmount = (isInternational) => {
    const errors = {};
    if (!isTreasurer) {
      return errors;
    }
    if (!isValidAmount(bsText)) {
      errors.treasurerBs = 'Escribe un monto válido en Bs, con hasta dos decimales';
    }
    if (isInternational && !isValidAmount(usdText)) {
      errors.treasurerUsd = 'Escribe un monto válido en USD, con hasta dos decimales';
    }
    return errors;
  };

  return {
    isTreasurer, bsText, usdText, setBsText: setCustomBs, setUsdText: setCustomUsd,
    finalBs, finalUsd, adjusted, resetToCalculated, loadSaved, validateAmount,
  };
}

export default useTreasurerTripAmount;
