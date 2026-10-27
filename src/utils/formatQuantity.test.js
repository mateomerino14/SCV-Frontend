import {describe, it, expect} from 'vitest';
import {formatQuantity, formatUnitPrice} from './formatQuantity';

describe('formatQuantity', () => {
  it('muestra enteros sin decimales y decimales hasta 3', () => {
    expect(formatQuantity('1.00')).toBe('1');
    expect(formatQuantity(53.34)).toBe('53.34');
    expect(formatQuantity('2.50')).toBe('2.5');
    expect(formatQuantity('53.345')).toBe('53.345');
    expect(formatQuantity(null)).toBe('');
  });

  it('muestra el precio unitario con 2 a 4 decimales, sin ceros de más', () => {
    expect(formatUnitPrice('3.7400')).toBe('3.74');
    expect(formatUnitPrice(3.7456)).toBe('3.7456');
    expect(formatUnitPrice('12.5')).toBe('12.50');
    expect(formatUnitPrice(8)).toBe('8.00');
    expect(formatUnitPrice('3.74567')).toBe('3.7457');
    expect(formatUnitPrice(null)).toBe('');
  });
});
