import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DailyBreakdownCard from './DailyBreakdownCard';

const days = [
  {fecha: '2026-10-20', montoBs: 100, montoUsd: 0},
  {fecha: '2026-10-21', montoBs: 0, montoUsd: 95},
  {fecha: '2026-10-22', montoBs: 290, montoUsd: 10},
];

describe('DailyBreakdownCard', () => {
  it('resume cuantos dias faltan justificar', () => {
    render(<DailyBreakdownCard dailyBreakdown={days} dailyRate={250} dailyRateUsd={80} isInternational />);
    expect(screen.getByText(/3 días con gastos · 2 días por justificar/)).toBeInTheDocument();
  });

  it('al abrirse muestra una barra por moneda y el estado de cada dia', async () => {
    render(<DailyBreakdownCard dailyBreakdown={days} dailyRate={250} dailyRateUsd={80} isInternational justifiedDays={['2026-10-21']} />);
    await userEvent.click(screen.getByText('Control Diario'));
    expect(screen.getAllByText('USD')).toHaveLength(3);
    expect(screen.getByText('Excedido · Justificado')).toBeInTheDocument();
    expect(screen.getByText('Excede en 40.00 Bs')).toBeInTheDocument();
  });

  it('en viajes nacionales solo muestra bolivianos', async () => {
    render(<DailyBreakdownCard dailyBreakdown={[days[0]]} dailyRate={250} defaultOpen />);
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
    expect(screen.getByText('Dentro del límite')).toBeInTheDocument();
  });

  it('no se muestra si no hay gastos', () => {
    const {container} = render(<DailyBreakdownCard dailyBreakdown={[]} dailyRate={250} />);
    expect(container).toBeEmptyDOMElement();
  });
});
