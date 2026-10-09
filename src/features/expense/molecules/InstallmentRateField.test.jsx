import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstallmentRateField from './InstallmentRateField';

describe('InstallmentRateField', () => {
  it('muestra el tipo de cambio automatico del dia sin campo editable', () => {
    render(<InstallmentRateField currency="PEN" date="2026-10-05" rateStatus="ok" exchangeRate="3.45" />);
    expect(screen.getByText('1 USD = 3.4500 PEN')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('en modo manual permite escribir el tipo de cambio', async () => {
    const onManualChange = vi.fn();
    render(<InstallmentRateField currency="PEN" date="2026-10-05" rateStatus="manual" exchangeRate="" onManualChange={onManualChange} />);
    expect(screen.getByText(/No se pudo obtener el tipo de cambio del día/)).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox'), '3');
    expect(onManualChange).toHaveBeenCalledWith('3');
  });

  it('sin fecha pide elegirla', () => {
    render(<InstallmentRateField currency="PEN" date="" rateStatus="nodate" />);
    expect(screen.getByText('Elige la fecha del gasto para obtener el tipo de cambio del día.')).toBeInTheDocument();
  });
});
