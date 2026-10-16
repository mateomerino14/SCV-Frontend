import {describe, it, expect} from 'vitest';
import {calculateWithholdings} from './withholdings';

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
});
