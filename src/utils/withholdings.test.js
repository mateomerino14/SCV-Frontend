import {describe, it, expect} from 'vitest';
import {calculateWithholdings, getExpenseWithholdings, roundCents} from './withholdings';

describe('calculateWithholdings', () => {
  it('servicio: lo pagado se incrementa y de esa base salen el RC-IVA 13% y el IT 3%', () => {
    expect(calculateWithholdings(40, 'S', false)).toEqual({base: 47.62, rcIva: 6.19, iue: 0, it: 1.43, cost: 47.62, toPay: 40});
  });

  it('cada retención sale de la base sin redondear y la base es lo pagado más las retenciones', () => {
    expect(calculateWithholdings(50, 'S', false)).toEqual({base: 59.53, rcIva: 7.74, iue: 0, it: 1.79, cost: 59.53, toPay: 50});
    expect(roundCents(1.005)).toBe(1.01);
  });

  it('compra: lo pagado se incrementa y de esa base salen el IUE 5% y el IT 3%', () => {
    expect(calculateWithholdings(92, 'C', false)).toEqual({base: 100, rcIva: 0, iue: 5, it: 3, cost: 100, toPay: 92});
  });

  it('sin retenciones en gastos internacionales', () => {
    expect(calculateWithholdings(80, 'S', true).toPay).toBe(80);
  });

  it('un gasto guardado se recalcula desde lo pagado', () => {
    const savedExpense = {tipo: 'S', monto_total: '40.00', retencion_rc_iva: '0', retencion_it: '0', importe_costo: '40.00'};
    expect(getExpenseWithholdings(savedExpense)).toMatchObject({rcIva: 6.19, it: 1.43, cost: 47.62, toPay: 40});
  });

  it('un gasto con alcohol no lleva retenciones', () => {
    expect(getExpenseWithholdings({tipo: 'C', monto_total: '100', tiene_alcohol: true}).toPay).toBe(100);
  });

  it('con subgastos calcula cada uno aparte y suma, como el recibo de papel', () => {
    expect(calculateWithholdings(240, 'S', false, [50, 80, 60, 50])).toEqual({base: 285.73, rcIva: 37.15, iue: 0, it: 8.58, cost: 285.73, toPay: 240});
    const expense = {tipo: 'S', monto_total: '240.00', Gasto_Subitem: [{monto: '50'}, {monto: '80'}, {monto: '60'}, {monto: '50'}]};
    expect(getExpenseWithholdings(expense).cost).toBe(285.73);
  });
});
