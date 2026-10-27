import {describe, it, expect} from 'vitest';
import {splitInvoiceTotal, calculateInvoiceVat, getExpenseInvoiceVat} from './invoiceAmounts';

describe('splitInvoiceTotal', () => {
  it('en una factura el IVA es el 13% del total y se resta de él', () => {
    expect(splitInvoiceTotal('305', 'F')).toEqual({subtotal: 265.35, vat: 39.65, total: 305});
    expect(splitInvoiceTotal(100, 'F')).toEqual({subtotal: 87, vat: 13, total: 100});
  });

  it('calcula el IVA como el 13% del total', () => {
    expect(calculateInvoiceVat('47.75')).toBe(6.21);
  });

  it('en un recibo el total es el monto y no hay IVA', () => {
    expect(splitInvoiceTotal('80.50', 'R')).toEqual({subtotal: 80.5, vat: 0, total: 80.5});
  });

  it('sin total devuelve ceros', () => {
    expect(splitInvoiceTotal('', 'F')).toEqual({subtotal: 0, vat: 0, total: 0});
  });

  it('solo las facturas tienen IVA en las revisiones', () => {
    expect(getExpenseInvoiceVat({tipo: 'F', monto_total: '305'})).toBe(39.65);
    expect(getExpenseInvoiceVat({tipo: 'R', monto_total: '305'})).toBe(0);
  });
});
