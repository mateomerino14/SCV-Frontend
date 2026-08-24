import {useState, useEffect} from 'react';
import {getPendingExpenseReviews} from '../../services/approval/reviewService';

const pollingInterval = 30 * 1000;

function useSupervisorPendingExpenseReviews() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: ''});
  const [statusFilter, setStatusFilter] = useState('TODOS');

  const load = async (currentFilters = filters) => {
    const data = await getPendingExpenseReviews(currentFilters);
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

    const polling = setInterval(() => {
      load();
    }, pollingInterval);

    return () => clearInterval(polling);
  }, []);

  const applyFilters = () => load(filters);

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: ''};
    setFilters(emptyFilters);
    setStatusFilter('TODOS');
    load(emptyFilters);
  };

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'TODOS') {
      return true;
    }
    if (statusFilter === 'OBSERVADO') {
      return trip.estadoRevision === 'OBSERVADO';
    }
    if (statusFilter === 'CONFORME') {
      return trip.estadoRevision === 'CONFORME';
    }
    return true;
  });

  return {
    trips: filteredTrips,
    total: trips.length,
    loading,
    error,
    filters,
    setFilters,
    statusFilter,
    setStatusFilter,
    applyFilters,
    clearFilters,
    reload: load,
  };
}

export default useSupervisorPendingExpenseReviews;