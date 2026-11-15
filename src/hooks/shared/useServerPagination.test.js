import {describe, it, expect, vi} from 'vitest';
import {renderHook, waitFor, act} from '@testing-library/react';
import useServerPagination from './useServerPagination';

const rows = Array.from({length: 40}, (_, index) => ({id: index + 1, nombre: `Fila ${index + 1}`}));

const fakeServer = vi.fn(async ({page, limit, search}) => {
  const matching = rows.filter((row) => !search || row.nombre.includes(search));
  return {items: matching.slice((page - 1) * limit, page * limit), total: matching.length};
});

describe('useServerPagination', () => {
  it('trae la primera página, carga más y no pasa del total', async () => {
    const {result} = renderHook(() => useServerPagination(fakeServer, {search: ''}, 15));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toHaveLength(15);
    expect(result.current.total).toBe(40);
    expect(result.current.hasMore).toBe(true);
    await act(() => result.current.loadMore());
    await act(() => result.current.loadMore());
    expect(result.current.items).toHaveLength(40);
    expect(result.current.hasMore).toBe(false);
    expect(new Set(result.current.items.map((row) => row.id)).size).toBe(40);
  });

  it('al recargar conserva las páginas que ya se habían cargado', async () => {
    const {result} = renderHook(() => useServerPagination(fakeServer, {search: ''}, 15));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(() => result.current.loadMore());
    await act(() => result.current.reload());
    expect(result.current.items).toHaveLength(30);
  });

  it('busca en el servidor después de una pausa y vuelve a la primera página', async () => {
    const {result, rerender} = renderHook(({search}) => useServerPagination(fakeServer, {search}, 15), {initialProps: {search: ''}});
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(() => result.current.loadMore());
    rerender({search: 'Fila 3'});
    await waitFor(() => expect(result.current.total).toBe(11));
    expect(result.current.items).toHaveLength(11);
    expect(result.current.params.search).toBe('Fila 3');
  });

  it('muestra el error del servidor sin filas', async () => {
    const failing = async () => ({error: 'Sin conexión'});
    const {result} = renderHook(() => useServerPagination(failing, {search: ''}, 15));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Sin conexión');
    expect(result.current.items).toHaveLength(0);
  });
});
