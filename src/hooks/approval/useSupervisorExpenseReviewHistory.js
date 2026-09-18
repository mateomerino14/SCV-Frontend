import {useState, useEffect} from 'react';
import {getSections} from '../../services/admin/adminService';
import {getMyExpenseReviews, returnExpenseReview, getReviewEmployees} from '../../services/approval/reviewService';

function useSupervisorExpenseReviewHistory() {
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const [statusFilter, setStatusFilter] = useState('EN_REVISION');

  const load = async (currentFilters = filters, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const data = await getMyExpenseReviews(currentFilters);
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
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters, false);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''};
    setFilters(emptyFilters);
    setStatusFilter('EN_REVISION');
    load(emptyFilters);
  };

  const handleReturn = async (tripId) => {
    const data = await returnExpenseReview(tripId);
    if (data.error) {
      setError(data.error);
      return;
    }
    await load();
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
    handleReturn,
  };
}

export default useSupervisorExpenseReviewHistory;