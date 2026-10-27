import {describe, it, expect} from 'vitest';
import {removeControlCharacters} from './textCleaner';

describe('Limpieza de caracteres invisibles', () => {
  it('quita saltos de línea, tabuladores y otros caracteres de control, y deja el resto', () => {
    expect(removeControlCharacters('00\t34\n31\u007F\u0085')).toBe('003431');
    expect(removeControlCharacters('BOL-$123@34 #9')).toBe('BOL-$123@34 #9');
    expect(removeControlCharacters('Ñandú áé')).toBe('Ñandú áé');
  });
});
