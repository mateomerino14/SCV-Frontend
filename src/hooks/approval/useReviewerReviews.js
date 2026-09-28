import {useState, useEffect, useCallback} from 'react';
import {getMyReviews, getReviewerEmployees} from '../../services/approval/reviewerService';
import {getSections} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useReviewerReviews() {
  const [myPending, setMyPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const [tab, setTab] = useState('MIS_PENDIENTES');

  const load = useCallback(async (currentFilters, showLoading = true) => {
    const activeFilters = currentFilters || filters;
    if (showLoading) {
      setLoading(true);
    }
    // El revisor es unico: todas las rendiciones de su etapa le llegan asignadas
    const historyData = await getMyReviews(activeFilters);
    if (showLoading) {
      setLoading(false);
    }
    if (historyData.error) {
      if (showLoading) {
        setError(historyData.error);
      }
      return;
    }
    setMyPending((historyData || []).filter((trip) => trip.estado === 'APROBADO_SUPERVISOR'));
    setApproved((historyData || []).filter((trip) => trip.estado === 'APROBADO_FINAL'));
    setRejected((historyData || []).filter((trip) => trip.estado === 'RECHAZADO'));
  }, [filters]);

  useEffect(() => {
    const start = async () => {
      await load(filters, true);
      const data = await getReviewerEmployees();
      if (!data.error) {
        setEmployees(data);
      }
      const sectionData = await getSections();
      if (!sectionData.error) {
        setSections(sectionData);
      }
    };
    start();
    const polling = setInterval(() => load(filters, false), pollingInterval);
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

  let trips = myPending;
  if (tab === 'APROBADOS') {
    trips = approved;
  }
  else if (tab === 'RECHAZADOS') {
    trips = rejected;
  }

  return {
    trips,
    totalMyPending: myPending.length,
    totalApproved: approved.length,
    totalRejected: rejected.length,
    employees,
    sections,
    loading,
    applyingFilters,
    error,
    filters,
    setFilters,
    tab,
    setTab,
    applyFilters,
    clearFilters,
    reload: load,
  };
}

export default useReviewerReviews;