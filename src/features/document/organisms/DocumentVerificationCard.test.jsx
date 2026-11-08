import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import DocumentVerificationCard from './DocumentVerificationCard';

const memo = {
  codigo: 'ABCD-EFGH-JKMN',
  tipo: 'Memorándum de autorización de viaje',
  emitido: '2026-11-08T14:00:00Z',
  viaje: {codigo: 'VJ-0001/2026', ruta: 'La Paz → Oruro', empleado: 'Juan Empleado'},
  resumen: {codigo: 'VJ-0001/2026', ruta: 'La Paz → Oruro', fechas: '10/11/2026 al 12/11/2026', fondo_bs: 600, fondo_usd: null, hospedaje: 'Empresa'},
  firmas: [],
};

describe('Verificación de un documento', () => {
  it('muestra el viaje y la ruta una sola vez y oculta los datos vacíos', () => {
    render(<DocumentVerificationCard document={memo} />);
    expect(screen.getAllByText('VJ-0001/2026')).toHaveLength(1);
    expect(screen.getAllByText('La Paz → Oruro')).toHaveLength(1);
    expect(screen.queryByText('Destino')).toBeNull();
    expect(screen.queryByText('Código del viaje')).toBeNull();
    expect(screen.queryByText('Fondo (USD)')).toBeNull();
    expect(screen.getByText('600.00')).toBeInTheDocument();
    expect(screen.getByText('La empresa reserva el hospedaje')).toBeInTheDocument();
  });

  it('en la planilla de un viaje nacional muestra los saldos solo en Bs', () => {
    render(<DocumentVerificationCard document={{...memo, tipo: 'Planilla de rendición', resumen: {gastos: 2, saldos: [{concepto: 'Saldo a favor de la empresa', bs: 120, usd: 0}]}}} />);
    expect(screen.getByText('Bs 120.00')).toBeInTheDocument();
    expect(screen.queryByText(/USD/)).toBeNull();
  });
});
