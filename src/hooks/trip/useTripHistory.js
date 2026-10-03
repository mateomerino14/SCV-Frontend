import {useState, useEffect, useRef} from 'react';
import {getTripHistory} from '../../services/trip/tripService';

const pageSize = 10;
const pollingInterval = 30 * 1000;

function useTripHistory() {
  const [trips, setTrips] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('TODOS');

  const load = async (currentPage, currentFilter, replace) => {
    if (replace) {
      setLoading(true);
    }
    else {
      setLoadingMore(true);
    }
    const data = await getTripHistory(currentPage, pageSize, currentFilter);
    setLoading(false);
    setLoadingMore(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setError('');
    setTotal(data.total || 0);
    if (replace) {
      setTrips(data.viajes || []);
    }
    else {
      setTrips((prev) => [...prev, ...(data.viajes || [])]);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1, filter, true);
  }, [filter]);

  // Cada 30 segundos recarga los viajes ya mostrados sin perder el Cargar mas
  const pollingStateRef = useRef({page, filter});
  useEffect(() => {
    pollingStateRef.current = {page, filter};
  }, [page, filter]);
  useEffect(() => {
    const polling = setInterval(async () => {
      const {page: currentPage, filter: currentFilter} = pollingStateRef.current;
      const data = await getTripHistory(1, currentPage * pageSize, currentFilter);
      if (data.error) {
        return;
      }
      setError('');
      setTotal(data.total || 0);
      setTrips(data.viajes || []);
    }, pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    load(nextPage, filter, false);
  };

  const hasMorePages = trips.length < total;

  return {
    trips,
    total,
    hasMorePages,
    loadMore,
    loading,
    loadingMore,
    error,
    filter, setFilter,
  };
}

export default useTripHistory;