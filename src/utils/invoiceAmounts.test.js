import {describe, it, expect} from 'vitest';
import {splitInvoiceTotal} from './invoiceAmounts';

describe('splitInvoiceTotal', () => {
  it('en una factura saca el IVA por dentro sin cambiar el total', () => {
    expect(splitInvoiceTotal('305', 'F')).toEqual({subtotal: 269.91, vat: 35.09, total: 305});
    expect(splitInvoiceTotal(113, 'F')).toEqual({subtotal: 100, vat: 13, total: 113});
  });

  it('en un recibo el total es el monto y no hay IVA', () => {
    expect(splitInvoiceTotal('80.50', 'R')).toEqual({subtotal: 80.5, vat: 0, total: 80.5});
  });

  it('sin total devuelve ceros', () => {
    expect(splitInvoiceTotal('', 'F')).toEqual({subtotal: 0, vat: 0, total: 0});
  });
});
