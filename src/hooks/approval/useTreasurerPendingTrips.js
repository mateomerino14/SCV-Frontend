import {useState, useEffect, useRef} from 'react';
import {getPendingTrips} from '../../services/approval/treasurerService';

const pollingInterval = 30 * 1000;

function useTreasurerPendingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: ''});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const data = await getPendingTrips(currentFilters);
    if (showLoading) {
      setLoading(false);
    }
    if (data.error) {
      setError(data.error);
      return;
    }
    setTrips(data);
  };

  useEffect(() => {
    load(filtersRef.current, true);
    const polling = setInterval(() => load(filtersRef.current, false), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = () => load(filters, true);
  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: ''};
    setFilters(emptyFilters);
    load(emptyFilters, true);
  };

  return {
    trips,
    total: trips.length,
    loading,
    error,
    filters, setFilters,
    applyFilters, clearFilters,
    reload: load,
  };
}

export default useTreasurerPendingTrips;