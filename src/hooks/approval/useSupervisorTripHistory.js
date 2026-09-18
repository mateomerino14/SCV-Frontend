import {useState, useEffect} from 'react';
import {getSections} from '../../services/admin/adminService';
import {getMyTripReviews, getReviewEmployees} from '../../services/approval/reviewService';

function useSupervisorTripHistory() {
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const [statusFilter, setStatusFilter] = useState('EN_REVISION_VIAJE');

  const load = async (currentFilters = filters, showLoading = true) => {
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
    setStatusFilter('EN_REVISION_VIAJE');
    load(emptyFilters);
  };

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'EN_REVISION_VIAJE') {
      return trip.estado === 'EN_REVISION_VIAJE';
    }
    if (statusFilter === 'APROBADO_VIAJE') {
      return ['APROBADO_VIAJE', 'EN_REVISION_TESORERO', 'EN_CURSO'].includes(trip.estado);
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
  };
}

export default useSupervisorTripHistory;