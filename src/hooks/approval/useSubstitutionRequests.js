import {useState} from 'react';
import {approveSubstitution, rejectSubstitution} from '../../services/approval/substitutionService';
import useInbox from './useInbox';

const noFilters = {};

function useSubstitutionRequests() {
  const [savingAction, setSavingAction] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('PENDIENTES');
  const inbox = useInbox('reemplazos', noFilters, tab);

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

  const handleApprove = (requestId) => runAction(() => approveSubstitution(requestId), 'Solicitud aprobada. La persona de reemplazo ya puede rendir el viaje.');

  const handleReject = (requestId, observation) => runAction(() => rejectSubstitution(requestId, observation), 'Solicitud rechazada. Se notificó al empleado.');

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

export default useSubstitutionRequests;
