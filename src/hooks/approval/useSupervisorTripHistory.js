import {useState, useEffect, useRef} from 'react';
import {getSections} from '../../services/admin/adminService';
import {getMyTripReviews, getReviewEmployees, returnTripReview} from '../../services/approval/reviewService';

const pollingInterval = 30 * 1000;

function useSupervisorTripHistory() {
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const [statusFilter, setStatusFilter] = useState('EN_REVISION_VIAJE');

  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const data = await getMyTripReviews(currentFilters);
    if (showLoading) {
      setLoading(false);
    }
    if (data.error) {
      setError(data.error);
      return;
    }
    setError('');
    setTrips(data);
  };

  useEffect(() => {
    load();
    getReviewEmployees().then((data) => {
      if (!data.error) {
        setEmployees(data);
      }
    });
    getSections().then((data) => {
      if (!data.error) {
        setSections(data);
      }
    });
    const polling = setInterval(() => load(filtersRef.current, false), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters, false);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''};
    setFilters(emptyFilters);
    setStatusFilter('EN_REVISION_VIAJE');
    load(emptyFilters);
  };

  // Devuelve un viaje tomado por error para que otro supervisor pueda revisarlo
  const handleReturn = async (tripId) => {
    const data = await returnTripReview(tripId);
    if (data.error) {
      setError(data.error);
      return;
    }
    setError('');
    await load();
  };

  // Pendiente solo si esta asignado a este supervisor; si ya lo aprobo sigue en Aprobados
  const isPendingForMe = (trip) => trip.estado === 'EN_REVISION_VIAJE' && trip.asignado_a_mi !== false;
  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'EN_REVISION_VIAJE') {
      return isPendingForMe(trip);
    }
    if (statusFilter === 'APROBADO_VIAJE') {
      return trip.resultado_revision === 'APROBADO' && !isPendingForMe(trip);
    }
    if (statusFilter === 'RECHAZADO') {
      return trip.resultado_revision === 'RECHAZADO';
    }
    return true;
  });

  return {
    handleReturn,
    trips: filteredTrips,
    total: filteredTrips.length,
    employees,
    sections,
    loading,
    applyingFilters,
    error,
    filters, setFilters,
    statusFilter, setStatusFilter,
    reload: load,
    applyFilters,
    clearFilters,
  };
}

export default useSupervisorTripHistory;