import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook, act, waitFor} from '@testing-library/react';
import useDailyExchangeRates, {installmentRateError} from './useDailyExchangeRates';
import {getDailyExchangeRate} from '../../services/expense/expenseService';

vi.mock('../../services/expense/expenseService', () => ({getDailyExchangeRate: vi.fn()}));

const installment = {id: 't1', currency: 'PEN', originAmount: '150', exchangeRate: ''};

describe('useDailyExchangeRates', () => {
  beforeEach(() => {
    getDailyExchangeRate.mockReset();
  });

  it('aplica el tipo de cambio del dia obtenido de la API', async () => {
    getDailyExchangeRate.mockResolvedValue({tasa: 3.45});
    const {result} = renderHook(() => useDailyExchangeRates());
    act(() => result.current.requestRates('2026-10-05', [installment]));
    await waitFor(() => expect(result.current.applyRates('2026-10-05', [installment])[0].rateStatus).toBe('ok'));
    expect(result.current.applyRates('2026-10-05', [installment])[0].exchangeRate).toBe('3.45');
  });

  it('consulta una sola vez la misma fecha y moneda', async () => {
    getDailyExchangeRate.mockResolvedValue({tasa: 3.45});
    const {result} = renderHook(() => useDailyExchangeRates());
    act(() => result.current.requestRates('2026-10-05', [installment, {...installment, id: 't2'}]));
    await waitFor(() => expect(result.current.applyRates('2026-10-05', [installment])[0].rateStatus).toBe('ok'));
    expect(getDailyExchangeRate).toHaveBeenCalledTimes(1);
  });

  it('si la API no responde, deja ingresar el tipo de cambio a mano', async () => {
    getDailyExchangeRate.mockResolvedValue({error: 'No se pudo', permiteManual: true});
    const {result} = renderHook(() => useDailyExchangeRates());
    act(() => result.current.requestRates('2026-10-05', [installment]));
    await waitFor(() => expect(result.current.applyRates('2026-10-05', [installment])[0].rateStatus).toBe('manual'));
    const manual = result.current.applyRates('2026-10-05', [{...installment, exchangeRate: '3.5'}])[0];
    expect(manual.exchangeRate).toBe('3.5');
    expect(installmentRateError(manual)).toBeNull();
  });

  it('sin fecha pide elegirla antes', () => {
    const {result} = renderHook(() => useDailyExchangeRates());
    const applied = result.current.applyRates('', [installment])[0];
    expect(applied.rateStatus).toBe('nodate');
    expect(installmentRateError(applied)).toBe('Elige la fecha del gasto para obtener el tipo de cambio');
  });
});
