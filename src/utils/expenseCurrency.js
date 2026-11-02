import {roundCents} from './withholdings';

export const usdCurrency = 'USD';
export const bsCurrency = 'BOB';
export const bothCurrencies = 'AMBOS';
export const renditionModes = [
  {value: usdCurrency, label: 'Dólares (USD)'},
  {value: bsCurrency, label: 'Bolivianos (Bs)'},
  {value: bothCurrencies, label: 'Ambos'},
];
export const maxNationalAmount = 99999.99;
export const maxForeignAmount = 9999999.99;
export const maxExchangeRate = 9999.9999;

const amountPattern = /^\d*\.?\d{0,2}$/;
const exchangeRatePattern = /^\d*\.?\d{0,4}$/;

export const isAmountInput = (value, maxAmount) => {
  if (value === '') {
    return true;
  }
  return amountPattern.test(value) && !(parseFloat(value) > maxAmount);
};

export const isExchangeRateInput = (value) => {
  if (value === '') {
    return true;
  }
  return exchangeRatePattern.test(value) && !(parseFloat(value) > maxExchangeRate);
};

export const amountLimitOf = (isInternationalExpense) => {
  if (isInternationalExpense) {
    return maxForeignAmount;
  }
  return maxNationalAmount;
};

export const usdRateOf = (currency, exchangeRate) => {
  if (currency === usdCurrency) {
    return 1;
  }
  return parseFloat(exchangeRate) || 0;
};

export const needsUsdRate = (mode, currency) => mode !== bsCurrency && currency !== usdCurrency;

export const needsBsRate = (mode, tripHasUsdFund) => mode === bothCurrencies || (mode === usdCurrency && !tripHasUsdFund);

export const convertForeignAmount = (amount, currency, exchangeRate, bsRate, mode = bothCurrencies) => {
  const paid = parseFloat(amount) || 0;
  if (mode === bsCurrency) {
    let bsOnly = null;
    if (parseFloat(exchangeRate) > 0 && paid > 0) {
      bsOnly = roundCents(paid * parseFloat(exchangeRate));
    }
    return {usd: null, bs: bsOnly};
  }
  const rate = usdRateOf(currency, exchangeRate);
  let usd = null;
  if (rate > 0 && paid > 0) {
    usd = roundCents(paid / rate);
  }
  let bs = null;
  if (usd !== null && parseFloat(bsRate) > 0) {
    bs = roundCents(usd * parseFloat(bsRate));
  }
  return {usd, bs};
};

export const validateForeignCurrency = (currency, exchangeRate, bsRate, mode = bothCurrencies, tripHasUsdFund = true) => {
  const errors = {};
  if (mode === bsCurrency && !(parseFloat(exchangeRate) > 0)) {
    errors.exchangeRate = `Indica cuántos Bs vale 1 ${currency}`;
  }
  if (needsUsdRate(mode, currency) && !(parseFloat(exchangeRate) > 0)) {
    errors.exchangeRate = 'El tipo de cambio es requerido';
  }
  if (needsBsRate(mode, tripHasUsdFund) && !(parseFloat(bsRate) > 0)) {
    errors.bsRate = 'El tipo de cambio a bolivianos es requerido';
  }
  return errors;
};

export const buildForeignCurrencyPayload = (amount, currency, exchangeRate, bsRate, mode = bothCurrencies) => {
  if (mode === bsCurrency) {
    return {
      moneda: currency,
      moneda_rendicion: bsCurrency,
      tipo_cambio: parseFloat(exchangeRate),
      monto_moneda_origen: amount,
      monto_total: convertForeignAmount(amount, currency, exchangeRate, bsRate, bsCurrency).bs,
    };
  }
  let savedBsRate = null;
  if (parseFloat(bsRate) > 0) {
    savedBsRate = parseFloat(bsRate);
  }
  return {
    moneda: currency,
    moneda_rendicion: mode,
    tipo_cambio: usdRateOf(currency, exchangeRate),
    tipo_cambio_bs: savedBsRate,
    monto_moneda_origen: amount,
    monto_total: convertForeignAmount(amount, currency, exchangeRate, bsRate).usd,
  };
};

export const isAmountInBs = (expense) => !!expense?.es_gasto_internacional && !!expense.monto_en_bs;

export const savedRenditionModeOf = (expense) => {
  if (isAmountInBs(expense)) {
    return bsCurrency;
  }
  if (expense.moneda_rendicion === usdCurrency) {
    return usdCurrency;
  }
  return bothCurrencies;
};

export const savedBsRateOf = (expense) => {
  if (isAmountInBs(expense)) {
    return 1;
  }
  return parseFloat(expense.tipo_cambio_bs) || 0;
};

const isCurrentInternational = (expense) => parseFloat(expense.tipo_cambio_bs) > 0 || !!expense.moneda_rendicion || !!expense.monto_en_bs;

export const hasOriginCurrencyLines = (expense) => !!expense.es_gasto_internacional && isCurrentInternational(expense) && (expense.moneda !== usdCurrency || !!expense.monto_en_bs);

export const conversionLabelOf = (segments) => {
  if (segments.length === 1) {
    return `${parseFloat(segments[0].monto_origen).toFixed(2)} ${segments[0].moneda}`;
  }
  return `${segments.length} tramos de cambio`;
};

export const amountInBsOf = (expense) => {
  const amount = parseFloat(expense.monto_total) || 0;
  if (!expense.es_gasto_internacional) {
    return amount;
  }
  const rate = savedBsRateOf(expense);
  if (rate > 0) {
    return roundCents(amount * rate);
  }
  return null;
};

export const originalAmountLinesOf = (expense) => {
  if (!expense.es_gasto_internacional) {
    return [];
  }
  const usd = (parseFloat(expense.monto_total) || 0).toFixed(2);
  if (isAmountInBs(expense)) {
    return [`${parseFloat(expense.monto_moneda_origen).toFixed(2)} ${expense.moneda} = ${usd} Bs (T/C ${parseFloat(expense.tipo_cambio).toFixed(4)} Bs por ${expense.moneda})`, 'Rendido en Bs'];
  }
  const rate = savedBsRateOf(expense);
  const segments = expense.Gasto_Tramo_Moneda || [];
  const lines = [];
  if (rate > 0 && expense.moneda && expense.moneda !== usdCurrency) {
    lines.push(`${parseFloat(expense.monto_moneda_origen).toFixed(2)} ${expense.moneda} = ${usd} USD (T/C ${parseFloat(expense.tipo_cambio).toFixed(4)})`);
  }
  else if (rate === 0 && segments.length > 0) {
    lines.push(...segments.map((segment) => `${parseFloat(segment.monto_origen).toFixed(2)} ${segment.moneda} = ${parseFloat(segment.monto_usd).toFixed(2)} USD`));
  }
  else {
    lines.push(`${usd} USD`);
  }
  if (rate > 0) {
    lines.push(`T/C ${rate.toFixed(4)} Bs por USD`);
  }
  else {
    lines.push('Sin T/C a Bs');
  }
  return lines;
};

export const defaultFundExchangeRate = 6.96;

export const fundExchangeRateOf = (trip) => parseFloat(trip?.tipo_cambio_fondo) || defaultFundExchangeRate;

export const hasUsdFund = (trip) => (parseFloat(trip?.monto_asignado_usd) || 0) > 0;

export const showsUsdFund = (trip) => trip?.tipo === 'Internacional' && hasUsdFund(trip);

export const renditionCurrencyOf = (trip, expense) => {
  if (isAmountInBs(expense)) {
    return bsCurrency;
  }
  if (expense.moneda_rendicion === usdCurrency || expense.moneda_rendicion === bsCurrency) {
    return expense.moneda_rendicion;
  }
  if (hasUsdFund(trip)) {
    return usdCurrency;
  }
  return bsCurrency;
};

export const isRenderedInUsd = (trip, expense) => {
  if (!expense.es_gasto_internacional || isAmountInBs(expense)) {
    return false;
  }
  if (amountInBsOf(expense) === null) {
    return true;
  }
  return hasUsdFund(trip) && renditionCurrencyOf(trip, expense) === usdCurrency;
};

export const amountLabelOf = (expense) => {
  if (!expense.es_gasto_internacional || isAmountInBs(expense)) {
    return 'Bs';
  }
  return usdCurrency;
};

export const spentAgainstFunds = (trip, expenses) => {
  let spentBs = 0;
  let spentUsd = 0;
  let internationalUsd = 0;
  (expenses || []).forEach((expense) => {
    const amount = parseFloat(expense.monto_total) || 0;
    if (!expense.es_gasto_internacional) {
      spentBs += amount;
      return;
    }
    if (!isAmountInBs(expense)) {
      internationalUsd += amount;
    }
    if (isRenderedInUsd(trip, expense)) {
      spentUsd += amount;
    }
    else {
      spentBs += amountInBsOf(expense);
    }
  });
  return {spentBs: roundCents(spentBs), spentUsd: roundCents(spentUsd), internationalUsd: roundCents(internationalUsd)};
};

export const summarizeStatement = (trip, expenses) => {
  const fundBs = parseFloat(trip.monto_asignado) || 0;
  const fundUsd = parseFloat(trip.monto_asignado_usd) || 0;
  const {spentBs, spentUsd, internationalUsd} = spentAgainstFunds(trip, expenses);
  const renderedUsd = spentUsd;
  const remainingBs = roundCents(fundBs - spentBs);
  const remainingUsd = roundCents(fundUsd - spentUsd);
  return {
    internationalUsd,
    renderedUsd,
    balanceRows: [
      ['Fondo Recibido', fundBs, fundUsd],
      ['Total Gastado', spentBs, spentUsd],
      ['Saldo en mi poder', remainingBs, remainingUsd],
      ['Importe a Devolver', Math.max(remainingBs, 0), Math.max(remainingUsd, 0)],
      ['Importe a Reembolsar', Math.max(-remainingBs, 0), Math.max(-remainingUsd, 0)],
    ],
  };
};
