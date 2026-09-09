import {useState, useEffect} from 'react';
import {getTripHistory} from '../../services/trip/tripService';

const pageSize = 10;

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