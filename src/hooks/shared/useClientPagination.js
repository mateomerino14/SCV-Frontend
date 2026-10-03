import {useState} from 'react';

// Paginacion Cargar mas para listas en memoria; resetKey vuelve a la primera pagina
function useClientPagination(items, pageSize = 15, resetKey = '') {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setVisibleCount(pageSize);
  }
  const visibleItems = items.slice(0, visibleCount);
  return {
    visibleItems,
    total: items.length,
    hasMorePages: visibleItems.length < items.length,
    loadMore: () => setVisibleCount((count) => count + pageSize),
  };
}

export default useClientPagination;
