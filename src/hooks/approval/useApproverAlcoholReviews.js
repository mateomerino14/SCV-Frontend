import {useState, useEffect, useRef} from 'react';
import {getMyAlcoholReviews} from '../../services/approval/approverAlcoholReviewService';
import {getMyExpenseReviews} from '../../services/approval/reviewService';
import {getEmployees} from '../../services/user/userService';
import {getSections} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useApproverAlcoholReviews() {
  const [myTrips, setMyTrips] = useState([]);
  const [teamTrips, setTeamTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('MIS_PENDIENTES');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const [myTripsData, teamTripsData] = await Promise.all([getMyAlcoholReviews(currentFilters), getMyExpenseReviews(currentFilters)]);
    if (showLoading) {
      setLoading(false);
    }
    if (myTripsData.error) {
      setError(myTripsData.error);
      return;
    }
    setError('');
    setMyTrips(myTripsData.map((trip) => ({...trip, etapa: 'NO_DEDUCIBLE'})));
    if (!teamTripsData.error) {
      setTeamTrips(teamTripsData.map((trip) => ({...trip, etapa: 'JEFE'})));
    }
  };

  useEffect(() => {
    const start = async () => {
      await load(filtersRef.current, true);
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
      const sectionData = await getSections();
      if (!sectionData.error) {
        setSections(sectionData);
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
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''};
    setFilters(emptyFilters);
    load(emptyFilters, true);
  };

  const isPendingForMe = (trip) => {
    if (trip.etapa === 'JEFE') {
      return trip.estado === 'EN_REVISION' && trip.asignado_a_mi !== false;
    }
    return trip.estado === 'EN_REVISION_APROBADOR' && trip.asignado_a_mi !== false;
  };
  const withoutRepeats = (trips) => trips.filter((trip, index) => trips.findIndex((other) => other.id_viaje === trip.id_viaje) === index);
  const allTrips = [...myTrips, ...teamTrips];
  const approvedTrips = withoutRepeats(allTrips.filter((trip) => trip.resultado_revision === 'APROBADO' && !isPendingForMe(trip)));
  const rejectedTrips = withoutRepeats(allTrips.filter((trip) => trip.resultado_revision === 'RECHAZADO'));
  const myPendingTrips = withoutRepeats(allTrips.filter(isPendingForMe));
  let displayedTrips = myPendingTrips;
  if (tab === 'APROBADOS') {
    displayedTrips = approvedTrips;
  }
  else if (tab === 'RECHAZADOS') {
    displayedTrips = rejectedTrips;
  }

  return {
    trips: displayedTrips,
    totalMyPending: myPendingTrips.length,
    totalApproved: approvedTrips.length,
    totalRejected: rejectedTrips.length,
    employees,
    sections,
    loading, applyingFilters, error,
    tab, setTab,
    filters, setFilters,
    applyFilters, clearFilters,
    reload: load,
  };
}

export default useApproverAlcoholReviews;
