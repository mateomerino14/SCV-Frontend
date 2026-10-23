import {describe, it, expect} from 'vitest';
import {getExpenseTaxValues} from './useTripExcelExport';

describe('getExpenseTaxValues', () => {
  it('en una factura el IVA es el 13% del total y el costo es el total menos el IVA', () => {
    const expense = {tipo: 'F', monto_total: '305.00', Factura: {monto_parcial: '265.35'}};
    expect(getExpenseTaxValues(expense)).toEqual({vat: 39.65, rcIva: 0, iue: 0, it: 0, cost: 265.35});
  });

  it('en un recibo no hay IVA y el costo es el importe', () => {
    const expense = {tipo: 'R', monto_total: '80.00', Factura: {monto_parcial: '80.00'}};
    expect(getExpenseTaxValues(expense)).toEqual({vat: 0, rcIva: 0, iue: 0, it: 0, cost: 80});
  });

  it('con alcohol se pierde el crédito fiscal y el costo es el importe', () => {
    const expense = {tipo: 'F', tiene_alcohol: true, monto_total: '113.00', Factura: {monto_parcial: '100.00'}};
    expect(getExpenseTaxValues(expense).cost).toBe(113);
  });

  it('en un gasto sin factura calcula las retenciones desde el total y el costo es el total', () => {
    const oldService = {tipo: 'S', monto_total: '47.62', retencion_rc_iva: '7.37', retencion_it: '1.70', importe_costo: '56.69'};
    expect(getExpenseTaxValues(oldService)).toEqual({vat: 0, rcIva: 6.19, iue: 0, it: 1.43, cost: 47.62});
  });
});
