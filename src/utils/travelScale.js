import {countryClassOf} from '../constants/countryClasses';

export const tripRatesOf = (scale, type, country) => {
  const dailyRate = parseFloat(scale?.monto_interior ?? 0);
  let countryClass = null;
  if (type === 'Internacional') {
    countryClass = countryClassOf(country);
  }
  let dailyRateUsd = 0;
  if (countryClass === 1) {
    dailyRateUsd = parseFloat(scale?.monto_clase_1_usd ?? 0);
  }
  else if (countryClass === 2) {
    dailyRateUsd = parseFloat(scale?.monto_clase_2_usd ?? 0);
  }
  return {dailyRate, dailyRateUsd, countryClass};
};

export const countPositionsByType = (positions) => positions.reduce((counts, position) => {
  counts[position.tipo_viatico] = (counts[position.tipo_viatico] || 0) + 1;
  return counts;
}, {});
