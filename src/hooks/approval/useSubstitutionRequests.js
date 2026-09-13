import {useState, useEffect, useCallback} from 'react';
import {getPendingSubstitutions, getSubstitutionHistory, approveSubstitution, rejectSubstitution} from '../../services/approval/substitutionService';

const pollingInterval = 30000;

function useSubstitutionRequests() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('PENDIENTES');

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    const [pendingData, historyData] = await Promise.all([getPendingSubstitutions(), getSubstitutionHistory()]);
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

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleApprove = async (requestId) => {
    setSavingAction(true);
    const data = await approveSubstitution(requestId);
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return false;
    }
    await load(true);
    return true;
  };

  const handleReject = async (requestId, observation) => {
    setSavingAction(true);
    const data = await rejectSubstitution(requestId, observation);
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return false;
    }
    await load(true);
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
  };
}

export default useSubstitutionRequests;