import {useState} from 'react';
import {approveRequest, rejectRequest} from '../../services/approval/deadlineAuthorizationService';
import useInbox from './useInbox';

const noFilters = {};

function useDeadlineAuthorizationRequests() {
  const [savingAction, setSavingAction] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('PENDIENTES');
  const inbox = useInbox('plazos', noFilters, tab);

  const runAction = async (action, successMessage) => {
    setSavingAction(true);
    const data = await action();
    setSavingAction(false);
    await inbox.reload();
    if (data.error) {
      setResult({success: false, message: data.error});
      return false;
    }
    setResult({success: true, message: successMessage});
    return true;
  };

  const handleApprove = (requestId) => runAction(() => approveRequest(requestId), 'Solicitud aprobada. El empleado ya puede registrar sus gastos fuera de plazo.');

  const handleReject = (requestId, observation) => runAction(() => rejectRequest(requestId, observation), 'Solicitud rechazada. Se notificó al empleado.');

  return {
    trips: inbox.trips,
    pagination: inbox.pagination,
    totalPending: inbox.counts.PENDIENTES || 0,
    loading: inbox.loading, savingAction, error: inbox.error,
    tab, setTab,
    handleApprove, handleReject,
    result, closeResult: () => setResult(null),
  };
}

export default useDeadlineAuthorizationRequests;
