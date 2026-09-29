import {useState, useEffect, useRef} from 'react';
import {getMyAlcoholReviews} from '../../services/approval/approverAlcoholReviewService';
import {getEmployees} from '../../services/user/userService';
import {getSections} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useApproverAlcoholReviews() {
  const [myTrips, setMyTrips] = useState([]);
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
    // El aprobador es unico: todas las rendiciones con alcohol le llegan asignadas
    const myTripsData = await getMyAlcoholReviews(currentFilters);
    if (showLoading) {
      setLoading(false);
    }
    if (myTripsData.error) {
      setError(myTripsData.error);
      return;
    }
    setMyTrips(myTripsData);
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

  // Aprobados y rechazados salen del historial de revision: solo lo que reviso este usuario
  const isPendingForMe = (trip) => trip.estado === 'EN_REVISION_APROBADOR' && trip.asignado_a_mi !== false;
  const approvedTrips = myTrips.filter((trip) => trip.resultado_revision === 'APROBADO' && !isPendingForMe(trip));
  const rejectedTrips = myTrips.filter((trip) => trip.resultado_revision === 'RECHAZADO');
  const myPendingTrips = myTrips.filter(isPendingForMe);
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
