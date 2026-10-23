import {describe, it, expect} from 'vitest';
import {calculateWithholdings, getExpenseWithholdings} from './withholdings';

describe('calculateWithholdings', () => {
  it('servicio: RC-IVA 13% e IT 3% sobre el total y se cancela el resto', () => {
    expect(calculateWithholdings(47.62, 'S', false)).toEqual({base: 47.62, rcIva: 6.19, iue: 0, it: 1.43, cost: 47.62, toPay: 40});
  });

  it('compra: IUE 5% e IT 3% sobre el total', () => {
    expect(calculateWithholdings(100, 'C', false)).toEqual({base: 100, rcIva: 0, iue: 5, it: 3, cost: 100, toPay: 92});
  });

  it('sin retenciones en gastos internacionales', () => {
    expect(calculateWithholdings(80, 'S', true).toPay).toBe(80);
  });

  it('un gasto guardado con el cálculo anterior se recalcula desde su total', () => {
    const oldExpense = {tipo: 'S', monto_total: '47.62', retencion_rc_iva: '7.37', retencion_it: '1.70', importe_costo: '56.69'};
    expect(getExpenseWithholdings(oldExpense)).toMatchObject({rcIva: 6.19, it: 1.43, cost: 47.62, toPay: 40});
  });

  it('un gasto con alcohol no lleva retenciones', () => {
    expect(getExpenseWithholdings({tipo: 'C', monto_total: '100', tiene_alcohol: true}).toPay).toBe(100);
  });
});
