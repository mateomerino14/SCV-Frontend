import {describe, it, expect, vi, afterEach} from 'vitest';
import {getPresetRange, toDateText} from './periodRange';

describe('periodRange', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('arma la fecha local sin pasar por UTC', () => {
    expect(toDateText(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('el mes actual va del primer al ultimo dia, tambien en febrero bisiesto', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2028, 1, 10));
    expect(getPresetRange('mes')).toEqual({fecha_inicio: '2028-02-01', fecha_fin: '2028-02-29'});
  });

  it('el año actual va del 1 de enero al 31 de diciembre', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 6, 1));
    expect(getPresetRange('anio')).toEqual({fecha_inicio: '2027-01-01', fecha_fin: '2027-12-31'});
  });

  it('todo el historial no tiene fechas', () => {
    expect(getPresetRange('todo')).toEqual({fecha_inicio: '', fecha_fin: ''});
  });
});
