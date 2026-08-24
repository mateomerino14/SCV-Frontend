import {useState, useEffect} from 'react';
import {getMyExpenseReviews} from '../../services/approval/reviewService';

function useSupervisorExpenseReviewHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: ''});
  const [statusFilter, setStatusFilter] = useState('EN_REVISION');

  const load = async (currentFilters = filters) => {
    setLoading(true);
    const data = await getMyExpenseReviews(currentFilters);
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setTrips(data);
  };

  useEffect(() => {
    load();
  }, []);

  const applyFilters = () => load(filters);

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: ''};
    setFilters(emptyFilters);
    setStatusFilter('EN_REVISION');
    load(emptyFilters);
  };

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'EN_REVISION') {
      return trip.estado === 'EN_REVISION';
    }
    if (statusFilter === 'APROBADO_SUPERVISOR') {
      return trip.estado === 'APROBADO_SUPERVISOR' || trip.estado === 'APROBADO_APROBADOR' || trip.estado === 'APROBADO_FINAL';
    }
    if (statusFilter === 'RECHAZADO') {
      return trip.estado === 'RECHAZADO';
    }
    return true;
  });

  return {
    trips: filteredTrips,
    total: filteredTrips.length,
    loading,
    error,
    filters, setFilters,
    statusFilter, setStatusFilter,
    reload: load,
    applyFilters,
    clearFilters,
  };
}

export default useSupervisorExpenseReviewHistory;