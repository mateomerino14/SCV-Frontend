import {describe, it, expect} from 'vitest';
import buildTripCode from './tripCode';

describe('Código del viaje', () => {
  it('usa el número anual del viaje', () => {
    expect(buildTripCode({id_viaje: 340, numero_viaje: 3, anio_viaje: 2027, fecha_inicio: '2027-01-05'})).toBe('VIA-3/2027');
  });

  it('si el viaje aún no tiene número anual usa su id', () => {
    expect(buildTripCode({id_viaje: 340, fecha_inicio: '2026-10-05'})).toBe('VIA-340/2026');
  });
});
