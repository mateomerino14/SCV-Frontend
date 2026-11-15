import {useCallback, useEffect, useRef} from 'react';
import {getInboxPage} from '../../services/approval/inboxService';
import useServerPagination from '../shared/useServerPagination';

const pollingInterval = 30 * 1000;
const pageSize = 12;

function useInbox(inboxName, filters, tab) {
  const fetchPage = useCallback((params) => getInboxPage(inboxName, params), [inboxName]);
  const list = useServerPagination(fetchPage, {...filters, tab}, pageSize);
  const reloadRef = useRef(list.reload);

  useEffect(() => {
    reloadRef.current = list.reload;
  });

  useEffect(() => {
    const polling = setInterval(() => reloadRef.current(true), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  return {
    trips: list.items,
    counts: list.counts,
    loading: list.loading,
    error: list.error,
    reload: list.reload,
    pagination: {
      visibleItems: list.items,
      total: list.total,
      hasMorePages: list.hasMore,
      loadMore: list.loadMore,
      loadingMore: list.loadingMore,
    },
  };
}

export default useInbox;
