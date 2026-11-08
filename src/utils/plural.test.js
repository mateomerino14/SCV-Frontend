import {describe, it, expect} from 'vitest';
import {pluralOf} from './plural';

describe('Plural de una palabra según la cantidad', () => {
  it('usa el singular solo cuando hay uno', () => {
    expect(pluralOf(1, 'viaje', 'viajes')).toBe('viaje');
    expect(pluralOf(0, 'viaje', 'viajes')).toBe('viajes');
    expect(pluralOf(3, 'día', 'días')).toBe('días');
  });
});
