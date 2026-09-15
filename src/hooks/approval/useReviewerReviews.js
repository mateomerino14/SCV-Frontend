import {useState, useEffect, useCallback} from 'react';
import {getPendingReviews, getMyReviews, getReviewerEmployees} from '../../services/approval/reviewerService';

const pollingInterval = 30 * 1000;

function useReviewerReviews() {
  const [pending, setPending] = useState([]);
  const [myPending, setMyPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''});
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [tab, setTab] = useState('PENDIENTES');

  const load = useCallback(async (currentFilters, showLoading = true) => {
    const activeFilters = currentFilters || filters;
    if (showLoading) {
      setLoading(true);
    }
    const [pendingData, historyData] = await Promise.all([
      getPendingReviews(activeFilters),
      getMyReviews(activeFilters),
    ]);
    if (showLoading) {
      setLoading(false);
    }
    if (pendingData.error) {
      if (showLoading) {
        setError(pendingData.error);
      }
      return;
    }
    if (historyData.error) {
      if (showLoading) {
        setError(historyData.error);
      }
      return;
    }
    setPending(pendingData);
    setMyPending((historyData || []).filter((trip) => trip.estado === 'APROBADO_SUPERVISOR'));
    setHistory((historyData || []).filter((trip) => trip.estado === 'APROBADO_FINAL' || trip.estado === 'RECHAZADO'));
  }, [filters]);

  useEffect(() => {
    const start = async () => {
      await load(filters, true);
      const data = await getReviewerEmployees();
      if (!data.error) {
        setEmployees(data);
      }
    };
    start();
    const polling = setInterval(() => load(filters, false), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  useEffect(() => {
    setStatusFilter('TODOS');
  }, [tab]);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters, false);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', numero_seccion: ''};
    setFilters(emptyFilters);
    setStatusFilter('TODOS');
    load(emptyFilters, true);
  };

  const filteredPending = pending.filter((trip) => {
    if (statusFilter === 'OBSERVADO') {
      return trip.estadoRevision === 'OBSERVADO';
    }
    if (statusFilter === 'CONFORME') {
      return trip.estadoRevision === 'CONFORME';
    }
    return true;
  });

  const filteredHistory = history.filter((trip) => {
    if (statusFilter === 'APROBADO_FINAL') {
      return trip.estado === 'APROBADO_FINAL';
    }
    if (statusFilter === 'RECHAZADO') {
      return trip.estado === 'RECHAZADO';
    }
    return true;
  });

  let trips = filteredPending;
  if (tab === 'MIS_PENDIENTES') {
    trips = myPending;
  }
  else if (tab === 'HISTORIAL') {
    trips = filteredHistory;
  }

  return {
    trips,
    totalPending: pending.length,
    totalMyPending: myPending.length,
    employees,
    loading,
    applyingFilters,
    error,
    filters,
    setFilters,
    statusFilter,
    setStatusFilter,
    tab,
    setTab,
    applyFilters,
    clearFilters,
    reload: load,
  };
}

export default useReviewerReviews;