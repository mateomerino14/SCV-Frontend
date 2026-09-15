import {useState, useEffect} from 'react';
import {getPendingExpenseReviews, takeExpenseReview} from '../../services/approval/reviewService';
import {getEmployees} from '../../services/user/userService';

const pollingInterval = 30 * 1000;

function useSupervisorPendingExpenseReviews() {
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [taking, setTaking] = useState(null);
  const [error, setError] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''});
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
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
      setLoading(false);
    };
    start();
    const polling = setInterval(() => {
      load();
    }, pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''};
    setFilters(emptyFilters);
    setStatusFilter('TODOS');
    load(emptyFilters);
  };

  const handleTake = async (tripId) => {
    setTaking(tripId);
    const data = await takeExpenseReview(tripId);
    setTaking(null);
    if (data.error) {
      if (data.error.includes('ya fue tomado') || data.error.includes('siendo revisado')) {
        setAlreadyTaken(true);
      }
      else {
        setError(data.error);
      }
      await load();
      return;
    }
    await load();
  };

  const closeAlreadyTakenModal = () => setAlreadyTaken(false);

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
    employees,
    loading,
    applyingFilters,
    taking,
    error,
    alreadyTaken,
    closeAlreadyTakenModal,
    filters,
    setFilters,
    statusFilter,
    setStatusFilter,
    applyFilters,
    clearFilters,
    handleTake,
    reload: load,
  };
}

export default useSupervisorPendingExpenseReviews;