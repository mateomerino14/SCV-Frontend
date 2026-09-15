import {useState, useEffect, useRef} from 'react';
import {getPendingAlcoholReviews, getMyAlcoholReviews, takeAlcoholReview} from '../../services/approval/approverAlcoholReviewService';
import {getEmployees} from '../../services/user/userService';

const pollingInterval = 30 * 1000;

function useApproverAlcoholReviews() {
  const [pending, setPending] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [taking, setTaking] = useState(null);
  const [error, setError] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [tab, setTab] = useState('PENDIENTES');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const [pendingData, myTripsData] = await Promise.all([
      getPendingAlcoholReviews(currentFilters),
      getMyAlcoholReviews(),
    ]);
    if (showLoading) {
      setLoading(false);
    }
    if (pendingData.error) {
      setError(pendingData.error);
      return;
    }
    if (myTripsData.error) {
      setError(myTripsData.error);
      return;
    }
    setPending(pendingData);
    setMyTrips(myTripsData);
  };

  useEffect(() => {
    const start = async () => {
      await load(filtersRef.current, true);
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
    };
    start();
    const polling = setInterval(() => load(filtersRef.current, false), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters, false);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''};
    setFilters(emptyFilters);
    load(emptyFilters, true);
  };

  const handleTake = async (tripId) => {
    setTaking(tripId);
    const data = await takeAlcoholReview(tripId);
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

  const approvedTrips = myTrips.filter((trip) => ['APROBADO_SUPERVISOR', 'APROBADO_FINAL'].includes(trip.estado));
  const rejectedTrips = myTrips.filter((trip) => trip.estado === 'RECHAZADO');
  let displayedTrips = pending;
  if (tab === 'APROBADOS') {
    displayedTrips = approvedTrips;
  }
  else if (tab === 'RECHAZADOS') {
    displayedTrips = rejectedTrips;
  }

  return {
    trips: displayedTrips,
    totalPending: pending.length,
    totalApproved: approvedTrips.length,
    totalRejected: rejectedTrips.length,
    employees,
    loading, applyingFilters, taking, error,
    alreadyTaken, closeAlreadyTakenModal,
    tab, setTab,
    filters, setFilters,
    applyFilters, clearFilters,
    handleTake,
    reload: load,
  };
}

export default useApproverAlcoholReviews;
