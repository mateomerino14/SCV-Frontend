import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import useUploadInvoice from './useUploadInvoice';
import {extractInvoice} from '../../services/expense/invoiceService';

vi.mock('../../services/expense/invoiceService', () => ({extractInvoice: vi.fn(), saveInvoice: vi.fn()}));
vi.mock('../../services/expense/expenseService', () => ({getCategories: vi.fn(async () => [])}));
vi.mock('../../utils/imageCompressor', () => ({compressImage: vi.fn(async (file) => file)}));

const pendingScans = {};

const photo = (name) => new File(['imagen'], name, {type: 'image/jpeg'});

const finishScan = async (name) => {
  await act(async () => {
    pendingScans[name]({proveedor: `Proveedor ${name}`, numero_factura: name, detalle: []});
  });
};

const providers = (result) => result.current.invoices.map((invoice) => invoice.data?.proveedor || null);

describe('useUploadInvoice', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:vista');
    URL.revokeObjectURL = vi.fn();
    extractInvoice.mockImplementation((file) => new Promise((resolve) => {
      pendingScans[file.name] = resolve;
    }));
  });

  it('cada foto recibe sus propios datos aunque se agreguen otras mientras se escanea', async () => {
    const {result} = renderHook(() => useUploadInvoice(1));
    await act(async () => {
      result.current.handleAddFiles([photo('A')]);
    });
    await act(async () => {
      result.current.handleAddFiles([photo('B'), photo('C')]);
    });
    await finishScan('A');
    await finishScan('B');
    await finishScan('C');
    expect(providers(result)).toEqual(['Proveedor A', 'Proveedor B', 'Proveedor C']);
    expect(result.current.invoices.some((invoice) => invoice.loading)).toBe(false);
    expect(result.current.currentInvoice.data.proveedor).toBe('Proveedor A');
  });

  it('no mezcla los datos cuando dos tandas de fotos llegan casi al mismo tiempo', async () => {
    const {result} = renderHook(() => useUploadInvoice(1));
    await act(async () => {
      result.current.handleAddFiles([photo('A')]);
      result.current.handleAddFiles([photo('B'), photo('C')]);
    });
    await finishScan('B');
    await finishScan('A');
    await finishScan('C');
    expect(providers(result)).toEqual(['Proveedor A', 'Proveedor B', 'Proveedor C']);
    expect(result.current.invoices.some((invoice) => invoice.loading)).toBe(false);
  });

  it('al eliminar una factura sigue seleccionada la misma que antes', async () => {
    const {result} = renderHook(() => useUploadInvoice(1));
    await act(async () => {
      result.current.handleAddFiles([photo('A'), photo('B'), photo('C')]);
    });
    await finishScan('A');
    await finishScan('B');
    await finishScan('C');
    act(() => {
      result.current.handleSelectInvoice(2);
    });
    act(() => {
      result.current.handleRequestDelete(0);
    });
    act(() => {
      result.current.handleConfirmDelete();
    });
    expect(providers(result)).toEqual(['Proveedor B', 'Proveedor C']);
    expect(result.current.currentInvoice.data.proveedor).toBe('Proveedor C');
    expect(result.current.expandedIndex).toBe(1);
  });
});
