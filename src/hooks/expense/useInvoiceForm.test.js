import {describe, it, expect, vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import useInvoiceForm from './useInvoiceForm';

const invoiceData = {tipo_doc: 'F', monto: '100.00', iva: '13.00', monto_total: '113.00'};

describe('useInvoiceForm', () => {
  it('con el total de una factura separa el IVA por dentro', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useInvoiceForm({...invoiceData, monto_total: ''}, onChange));
    act(() => {
      result.current.handleFieldChange('monto_total', '305');
    });
    expect(onChange).toHaveBeenCalledWith('monto_total', '305');
    expect(onChange).toHaveBeenCalledWith('monto', '269.91', true);
    expect(onChange).toHaveBeenCalledWith('iva', '35.09', true);
  });

  it('al pasar a recibo conserva el total pagado sin IVA', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useInvoiceForm(invoiceData, onChange));
    act(() => {
      result.current.handleDocTypeChange('R');
    });
    expect(onChange).toHaveBeenCalledWith('tipo_doc', 'R');
    expect(onChange).toHaveBeenCalledWith('monto', '113.00', true);
    expect(onChange).toHaveBeenCalledWith('iva', '0.00', true);
  });

  it('acepta códigos de recibo con símbolos', () => {
    const onChange = vi.fn();
    const {result} = renderHook(() => useInvoiceForm(invoiceData, onChange));
    act(() => {
      result.current.handleFieldChange('numero_factura', 'BOL-$45@7#A');
    });
    expect(onChange).toHaveBeenCalledWith('numero_factura', 'BOL-$45@7#A');
  });
});
