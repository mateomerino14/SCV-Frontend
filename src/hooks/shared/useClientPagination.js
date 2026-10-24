import {useState} from 'react';

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
