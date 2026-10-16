import {describe, it, expect} from 'vitest';
import {getExpenseTaxValues} from './useTripExcelExport';

describe('getExpenseTaxValues', () => {
  it('en una factura el costo es el importe menos el IVA', () => {
    const expense = {tipo: 'F', monto_total: '305.00', Factura: {monto_parcial: '269.91'}};
    expect(getExpenseTaxValues(expense)).toEqual({vat: 35.09, rcIva: 0, iue: 0, it: 0, cost: 269.91});
  });

  it('en un recibo no hay IVA y el costo es el importe', () => {
    const expense = {tipo: 'R', monto_total: '80.00', Factura: {monto_parcial: '80.00'}};
    expect(getExpenseTaxValues(expense)).toEqual({vat: 0, rcIva: 0, iue: 0, it: 0, cost: 80});
  });

  it('con alcohol se pierde el crédito fiscal y el costo es el importe', () => {
    const expense = {tipo: 'F', tiene_alcohol: true, monto_total: '113.00', Factura: {monto_parcial: '100.00'}};
    expect(getExpenseTaxValues(expense).cost).toBe(113);
  });
});
