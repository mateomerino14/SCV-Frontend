import {useState, useEffect, useRef, useCallback} from 'react';

const searchDelay = 300;
const emptyResult = {key: null, items: [], total: 0, counts: {}, page: 1, error: ''};

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function useServerPagination(fetchPage, filters, pageSize = 15) {
  const [result, setResult] = useState(emptyResult);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestRef = useRef(0);
  const debouncedSearch = useDebouncedValue(filters.search || '', searchDelay);
  const params = {...filters, search: debouncedSearch.trim()};
  const paramsKey = JSON.stringify(params);

  const fetchPages = useCallback(async (lastPage) => {
    const request = requestRef.current + 1;
    requestRef.current = request;
    let items = [];
    let total = 0;
    let counts = {};
    for (let current = 1; current <= lastPage; current++) {
      const data = await fetchPage({...JSON.parse(paramsKey), page: current, limit: pageSize});
      if (request !== requestRef.current) {
        return null;
      }
      if (data.error) {
        return {...emptyResult, key: paramsKey, error: data.error};
      }
      items = [...items, ...data.items];
      total = data.total;
      counts = data.counts || {};
      if (items.length >= total) {
        break;
      }
    }
    return {key: paramsKey, items, total, counts, page: lastPage, error: ''};
  }, [fetchPage, paramsKey, pageSize]);

  useEffect(() => {
    fetchPages(1).then((loaded) => {
      if (loaded) {
        setResult(loaded);
      }
    });
  }, [fetchPages]);

  const reload = async (silent = false) => {
    const loaded = await fetchPages(result.page);
    if (!loaded || (silent && loaded.error)) {
      return;
    }
    setResult(loaded);
  };

  const loadMore = async () => {
    const nextPage = result.page + 1;
    const request = requestRef.current + 1;
    requestRef.current = request;
    setLoadingMore(true);
    const data = await fetchPage({...params, page: nextPage, limit: pageSize});
    setLoadingMore(false);
    if (request !== requestRef.current) {
      return;
    }
    if (data.error) {
      setResult((previous) => ({...previous, error: data.error}));
      return;
    }
    setResult((previous) => ({...previous, items: [...previous.items, ...data.items], total: data.total, counts: data.counts || previous.counts, page: nextPage}));
  };

  return {
    items: result.items,
    total: result.total,
    counts: result.counts,
    error: result.error,
    loading: result.key !== paramsKey,
    loadingMore,
    params,
    hasMore: result.items.length < result.total,
    loadMore, reload,
  };
}

export default useServerPagination;
