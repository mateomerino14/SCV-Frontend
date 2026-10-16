import {describe, it, expect, vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import useInvoiceDetailPanel from './useInvoiceDetailPanel';

describe('useInvoiceDetailPanel', () => {
  it('agrega un producto con cantidad decimal', () => {
    const onAdd = vi.fn();
    const {result} = renderHook(() => useInvoiceDetailPanel([], onAdd, vi.fn()));
    act(() => {
      result.current.handleFieldChange('nombre_producto', 'Gasolina');
      result.current.handleFieldChange('precio', '3.74');
      result.current.handleFieldChange('cantidad', '53,345');
    });
    act(() => {
      result.current.handleAdd();
    });
    expect(onAdd).toHaveBeenCalledWith({nombre_producto: 'Gasolina', precio: 3.74, cantidad: 53.345});
  });

  it('no deja escribir más de 3 decimales en la cantidad', () => {
    const {result} = renderHook(() => useInvoiceDetailPanel([], vi.fn(), vi.fn()));
    act(() => {
      result.current.handleFieldChange('cantidad', '1.255');
    });
    act(() => {
      result.current.handleFieldChange('cantidad', '1.2555');
    });
    expect(result.current.item.cantidad).toBe('1.255');
  });
});
