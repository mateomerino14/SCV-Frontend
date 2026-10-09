import {describe, it, expect} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import useRequestedAmounts from './useRequestedAmounts';

const render = (type) => renderHook(() => useRequestedAmounts({type, days: 4, dailyRate: 300, dailyRateUsd: 40}));

describe('useRequestedAmounts', () => {
  it('el tope es dias por tarifa mas el hospedaje', () => {
    const {result} = render('Nacional');
    act(() => result.current.handleAmountChange('lodging')('400'));
    expect(result.current.referenceBs).toBe(1200);
    expect(result.current.limitBs).toBe(1600);
    expect(result.current.limitUsd).toBe(0);
  });

  it('en internacionales calcula un tope por cada moneda', () => {
    const {result} = render('Internacional');
    act(() => result.current.handleAmountChange('lodgingUsd')('120'));
    expect(result.current.limitBs).toBe(1200);
    expect(result.current.limitUsd).toBe(280);
  });

  it('no deja escribir mas de dos decimales ni letras', () => {
    const {result} = render('Nacional');
    act(() => result.current.handleAmountChange('requested')('10.555'));
    act(() => result.current.handleAmountChange('requested')('abc'));
    expect(result.current.amounts.requested).toBe('');
  });

  it('marca error si el monto supera el tope', () => {
    const {result} = render('Nacional');
    act(() => result.current.handleAmountChange('requested')('1500'));
    let errors;
    act(() => {
      errors = result.current.validateAmounts();
    });
    expect(errors.requested).toBe('No puede superar el tope de 1200.00 Bs');
  });

  it('exige indicar algun monto', () => {
    const {result} = render('Nacional');
    let errors;
    act(() => {
      errors = result.current.validateAmounts();
    });
    expect(errors.requested).toBe('Indica el monto que solicitas');
  });

  it('solicitar el tope completo llena ambos montos', () => {
    const {result} = render('Internacional');
    act(() => result.current.fillWithLimits());
    expect(result.current.amounts.requested).toBe('1200.00');
    expect(result.current.amounts.requestedUsd).toBe('160.00');
    expect(result.current.buildAmountsPayload()).toEqual({
      monto_solicitado: 1200, hospedaje_estimado: 0, monto_solicitado_usd: 160, hospedaje_estimado_usd: 0,
    });
  });

  it('en nacionales no envia montos en dolares', () => {
    const {result} = render('Nacional');
    act(() => result.current.handleAmountChange('requested')('500'));
    act(() => result.current.handleAmountChange('requestedUsd')('99'));
    expect(result.current.buildAmountsPayload().monto_solicitado_usd).toBe(0);
  });
});
