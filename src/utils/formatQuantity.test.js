import {describe, it, expect} from 'vitest';
import {formatQuantity} from './formatQuantity';

describe('formatQuantity', () => {
  it('muestra enteros sin decimales y decimales hasta 3', () => {
    expect(formatQuantity('1.00')).toBe('1');
    expect(formatQuantity(53.34)).toBe('53.34');
    expect(formatQuantity('2.50')).toBe('2.5');
    expect(formatQuantity('53.345')).toBe('53.345');
    expect(formatQuantity(null)).toBe('');
  });
});
