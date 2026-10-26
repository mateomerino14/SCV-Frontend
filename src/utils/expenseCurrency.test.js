import {describe, it, expect} from 'vitest';
import {convertForeignAmount, validateForeignCurrency, buildForeignCurrencyPayload, isAmountInput, isExchangeRateInput, hasOriginCurrencyLines, conversionLabelOf} from './expenseCurrency';

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
    expect(buildForeignCurrencyPayload(170, 'PEN', '3.78', '6.96')).toEqual({moneda: 'PEN', tipo_cambio: 3.78, tipo_cambio_bs: 6.96, monto_moneda_origen: 170, monto_total: 44.97});
    expect(buildForeignCurrencyPayload(20, 'USD', '9', '6.96').tipo_cambio).toBe(1);
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
