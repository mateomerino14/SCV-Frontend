import {useState, useEffect, useRef} from 'react';
import {getPendingTripReviews} from '../../services/approval/reviewService';

const pollingInterval = 30 * 1000;

function useSupervisorPendingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: ''});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current) => {
    const data = await getPendingTripReviews(currentFilters);
    if (data.error) {
      setError(data.error);
      return;
    }
    setTrips(data);
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      await load();
      setLoading(false);
    };
    start();
    const polling = setInterval(() => load(), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = () => load(filters);

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: ''};
    setFilters(emptyFilters);
    load(emptyFilters);
  };

  return {
    trips,
    total: trips.length,
    loading, error, filters, setFilters,
    applyFilters, clearFilters,
    reload: load,
  };
}

export default useSupervisorPendingTrips;