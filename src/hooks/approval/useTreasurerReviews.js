import {useState, useEffect, useRef} from 'react';
import {getPendingTrips, getMyTrips} from '../../services/approval/treasurerService';
import {getEmployees} from '../../services/user/userService';

const pollingInterval = 30 * 1000;

function useTreasurerReviews() {
  const [pending, setPending] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('PENDIENTES');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: ''});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const [pendingData, myTripsData] = await Promise.all([
      getPendingTrips(currentFilters),
      getMyTrips(),
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
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: ''};
    setFilters(emptyFilters);
    load(emptyFilters, true);
  };

  const approvedTrips = myTrips.filter((trip) => trip.estado === 'EN_CURSO');
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
    loading, applyingFilters, error,
    tab, setTab,
    filters, setFilters,
    applyFilters, clearFilters,
  };
}

export default useTreasurerReviews;