import {describe, it, expect, vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import useTreasurerTripAmount from './useTreasurerTripAmount';

const treasurer = vi.hoisted(() => ({value: true}));

vi.mock('../user/useIsTreasurer', () => ({default: () => ({isTreasurer: treasurer.value, loading: false})}));

describe('Monto del viaje del tesorero', () => {
  it('parte del monto calculado y usa el que ajusta el tesorero', () => {
    treasurer.value = true;
    const {result} = renderHook(() => useTreasurerTripAmount(900, 0));
    expect(result.current.bsText).toBe('900.00');
    expect(result.current.adjusted).toBe(false);
    act(() => result.current.setBsText('1234.5'));
    expect(result.current.finalBs).toBe(1234.5);
    expect(result.current.adjusted).toBe(true);
    act(() => result.current.resetToCalculated());
    expect(result.current.finalBs).toBe(900);
  });

  it('pide un monto válido al tesorero', () => {
    treasurer.value = true;
    const {result} = renderHook(() => useTreasurerTripAmount(900, 120));
    act(() => {
      result.current.setBsText('abc');
      result.current.setUsdText('');
    });
    expect(result.current.validateAmount(true)).toEqual({
      treasurerBs: 'Escribe un monto válido en Bs, con hasta dos decimales',
      treasurerUsd: 'Escribe un monto válido en USD, con hasta dos decimales',
    });
    expect(result.current.finalBs).toBe(900);
  });

  it('a quien no es tesorero le deja siempre el monto calculado', () => {
    treasurer.value = false;
    const {result} = renderHook(() => useTreasurerTripAmount(900, 0));
    act(() => result.current.setBsText('5000'));
    expect(result.current.finalBs).toBe(900);
    expect(result.current.adjusted).toBe(false);
    expect(result.current.validateAmount(false)).toEqual({});
  });
});
