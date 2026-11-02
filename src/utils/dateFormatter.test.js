import {describe, it, expect} from 'vitest';
import {formatDateNumeric} from './dateFormatter';

describe('formato de fechas', () => {
  it('muestra la fecha como día/mes/año', () => {
    expect(formatDateNumeric('2026-11-04')).toBe('04/11/2026');
    expect(formatDateNumeric('2026-11-04T10:00:00')).toBe('04/11/2026');
    expect(formatDateNumeric(null)).toBe('');
  });
});
