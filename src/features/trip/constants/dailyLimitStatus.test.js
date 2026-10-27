import {describe, it, expect} from 'vitest';
import {getLimitStatus, describeDayExcess} from './dailyLimitStatus';

describe('getLimitStatus', () => {
  it('dentro del limite por debajo del 80%', () => {
    expect(getLimitStatus(100, 250)).toBe('OK');
  });

  it('cerca del limite desde el 80% hasta el limite exacto', () => {
    expect(getLimitStatus(200, 250)).toBe('NEAR');
    expect(getLimitStatus(250, 250)).toBe('NEAR');
  });

  it('excedido cuando supera el limite', () => {
    expect(getLimitStatus(250.01, 250)).toBe('EXCEEDED');
  });

  it('sin limite configurado nunca marca exceso', () => {
    expect(getLimitStatus(500, 0)).toBe('OK');
  });
});

describe('describeDayExcess', () => {
  it('describe el exceso en las dos monedas', () => {
    const day = {montoBs: 320, montoUsd: 95, excedeBs: true, excedeUsd: true};
    expect(describeDayExcess(day, 250, 80)).toBe('320.00 Bs (límite 250.00) y 95.00 USD (límite 80.00)');
  });

  it('describe solo la moneda excedida', () => {
    const day = {montoBs: 100, montoUsd: 95, excedeBs: false, excedeUsd: true};
    expect(describeDayExcess(day, 250, 80)).toBe('95.00 USD (límite 80.00)');
  });
});
