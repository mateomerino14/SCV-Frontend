import {useState, useEffect, useCallback} from 'react';
import {getPendingRequests, getRequestHistory, approveRequest, rejectRequest} from '../../services/approval/deadlineAuthorizationService';

const pollingInterval = 30000;

function useDeadlineAuthorizationRequests() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  // Resultado de aprobar o rechazar, en una ventana emergente: {success, message}
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('PENDIENTES');

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const [pendingData, historyData] = await Promise.all([getPendingRequests(), getRequestHistory()]);
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
    setHistory(historyData);
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  useEffect(() => {
    const interval = setInterval(() => {
      load(false);
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [load]);


  const handleApprove = async (requestId) => {
    setSavingAction(true);
    const data = await approveRequest(requestId);
    setSavingAction(false);
    if (data.error) {
      // La solicitud pudo haberse cerrado o atendido mientras tanto: se actualiza la lista
      await load(false);
      setResult({success: false, message: data.error});
      return false;
    }
    await load(true);
    setResult({success: true, message: 'Solicitud aprobada. El empleado ya puede registrar sus gastos fuera de plazo.'});
    return true;
  };

  const handleReject = async (requestId, observation) => {
    setSavingAction(true);
    const data = await rejectRequest(requestId, observation);
    setSavingAction(false);
    if (data.error) {
      // La solicitud pudo haberse cerrado o atendido mientras tanto: se actualiza la lista
      await load(false);
      setResult({success: false, message: data.error});
      return false;
    }
    await load(true);
    setResult({success: true, message: 'Solicitud rechazada. Se notificó al empleado.'});
    return true;
  };

  let trips = pending;
  if (tab !== 'PENDIENTES') {
    trips = history;
  }

  return {
    trips,
    totalPending: pending.length,
    loading, savingAction, error,
    tab, setTab,
    handleApprove, handleReject,
    result, closeResult: () => setResult(null),
  };
}

export default useDeadlineAuthorizationRequests;