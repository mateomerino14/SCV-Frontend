import {describe, it, expect} from 'vitest';
import {convertForeignAmount, validateForeignCurrency, buildForeignCurrencyPayload, isAmountInput, isExchangeRateInput, hasOriginCurrencyLines, conversionLabelOf, hasUsdFund, showsUsdFund, spentAgainstFunds, summarizeStatement, amountInBsOf, savedRenditionModeOf, originalAmountLinesOf} from './expenseCurrency';

describe('Moneda de un gasto internacional', () => {
  it('pasa el monto en soles a USD y a Bs con los tipos de cambio del empleado', () => {
    expect(convertForeignAmount(170, 'PEN', '3.78', '6.96')).toEqual({usd: 44.97, bs: 312.99});
    expect(convertForeignAmount(50, 'USD', '', '6.96')).toEqual({usd: 50, bs: 348});
    expect(convertForeignAmount(50, 'PEN', '', '6.96')).toEqual({usd: null, bs: null});
  });

  it('pide el tipo de cambio a USD solo en otra moneda y siempre el de Bs', () => {
    expect(validateForeignCurrency('USD', '', '6.96')).toEqual({});
    expect(Object.keys(validateForeignCurrency('PEN', '', ''))).toEqual(['exchangeRate', 'bsRate']);
  });

  it('arma los datos que se envían con el monto en USD', () => {
    expect(buildForeignCurrencyPayload(170, 'PEN', '3.78', '6.96')).toEqual({moneda: 'PEN', moneda_rendicion: 'AMBOS', tipo_cambio: 3.78, tipo_cambio_bs: 6.96, monto_moneda_origen: 170, monto_total: 44.97});
    expect(buildForeignCurrencyPayload(20, 'USD', '9', '6.96').tipo_cambio).toBe(1);
  });

  it('según cómo se rinde pide solo el tipo de cambio que hace falta', () => {
    expect(buildForeignCurrencyPayload(170, 'PEN', '1.85', '', 'BOB')).toEqual({moneda: 'PEN', moneda_rendicion: 'BOB', tipo_cambio: 1.85, monto_moneda_origen: 170, monto_total: 314.5});
    expect(buildForeignCurrencyPayload(150, 'PEN', '3.75', '', 'USD')).toMatchObject({moneda_rendicion: 'USD', tipo_cambio_bs: null, monto_total: 40});
    expect(validateForeignCurrency('PEN', '', '', 'BOB')).toEqual({exchangeRate: 'Indica cuántos Bs vale 1 PEN'});
    expect(validateForeignCurrency('PEN', '3.75', '', 'USD', true)).toEqual({});
    expect(validateForeignCurrency('PEN', '3.75', '', 'USD', false)).toEqual({bsRate: 'El tipo de cambio a bolivianos es requerido'});
    expect(validateForeignCurrency('USD', '', '6.96', 'AMBOS')).toEqual({});
  });

  it('un gasto rendido solo en Bs ya está en bolivianos y sale del fondo en Bs', () => {
    const expense = {es_gasto_internacional: true, monto_en_bs: true, moneda: 'PEN', monto_moneda_origen: 170, tipo_cambio: 1.85, monto_total: 314.5};
    expect(amountInBsOf(expense)).toBe(314.5);
    expect(savedRenditionModeOf(expense)).toBe('BOB');
    expect(originalAmountLinesOf(expense)[0]).toBe('170.00 PEN = 314.50 Bs (T/C 1.8500 Bs por PEN)');
    expect(spentAgainstFunds({tipo: 'Internacional', monto_asignado_usd: 100}, [expense])).toEqual({spentBs: 314.5, spentUsd: 0, internationalUsd: 0});
  });

  it('acepta montos de 2 decimales y tipos de cambio de 4', () => {
    expect(isAmountInput('12.34', 100)).toBe(true);
    expect(isAmountInput('12.345', 100)).toBe(false);
    expect(isAmountInput('101', 100)).toBe(false);
    expect(isExchangeRateInput('6.9612')).toBe(true);
    expect(isExchangeRateInput('6.96123')).toBe(false);
  });

  it('distingue los gastos nuevos en otra moneda y describe su conversión', () => {
    expect(hasOriginCurrencyLines({es_gasto_internacional: true, moneda: 'PEN', tipo_cambio_bs: '6.96'})).toBe(true);
    expect(hasOriginCurrencyLines({es_gasto_internacional: true, moneda: 'PEN', tipo_cambio_bs: null})).toBe(false);
    expect(conversionLabelOf([{monto_origen: '170', moneda: 'PEN'}])).toBe('170.00 PEN');
    expect(conversionLabelOf([{}, {}])).toBe('2 tramos de cambio');
  });
});

describe('fondo de un viaje internacional', () => {
  const expenses = [
    {monto_total: '100', es_gasto_internacional: false},
    {monto_total: '50', tipo_cambio_bs: '10', es_gasto_internacional: true},
  ];

  it('descuenta los gastos internacionales del fondo en Bs si no hay fondo en USD', () => {
    const trip = {tipo: 'Internacional', monto_asignado: 1000, monto_asignado_usd: 0};
    expect(hasUsdFund(trip)).toBe(false);
    expect(showsUsdFund(trip)).toBe(false);
    expect(spentAgainstFunds(trip, expenses)).toEqual({spentBs: 600, spentUsd: 0, internationalUsd: 50});
    expect(summarizeStatement(trip, expenses).balanceRows[2]).toEqual(['Saldo en mi poder', 400, 0]);
  });

  it('sigue usando el fondo en USD cuando el viaje lo tiene', () => {
    const trip = {tipo: 'Internacional', monto_asignado: 1000, monto_asignado_usd: 80};
    expect(showsUsdFund(trip)).toBe(true);
    expect(spentAgainstFunds(trip, expenses)).toEqual({spentBs: 100, spentUsd: 50, internationalUsd: 50});
  });
});
