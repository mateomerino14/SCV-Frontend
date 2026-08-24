import {useState, useEffect} from 'react';
import {requestAuthorization, getRequestStatus} from '../../services/approval/deadlineAuthorizationService';

function useDeadlineAuthorization(tripId) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    if (!tripId) {
      return;
    }
    setLoading(true);
    const data = await getRequestStatus(tripId);
    setLoading(false);
    if (data.error) {
      return;
    }
    setRequest(data);
  };

  useEffect(() => {
    load();
  }, [tripId]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const handleRequest = async (reason) => {
    if (!reason.trim()) {
      showError('Debes indicar el motivo del retraso');
      return false;
    }
    setSubmitting(true);
    const data = await requestAuthorization(tripId, reason.trim());
    setSubmitting(false);
    if (data.error) {
      showError(data.error);
      return false;
    }
    setShowModal(false);
    await load();
    return true;
  };

  const isPending = request?.estado === 'PENDIENTE';
  const isRejected = request?.estado === 'RECHAZADA';
  const isApprovedActive = request?.estado === 'APROBADA' && !request?.extension_vencida;
  const isApprovedExpired = request?.estado === 'APROBADA' && !!request?.extension_vencida;

  const canRequest = !request || isRejected || isApprovedExpired;

  return {
    request, loading, submitting, error,
    showModal, setShowModal,
    isPending, isApproved: isApprovedActive, isRejected, isApprovedExpired, canRequest,
    handleRequest, reload: load,
  };
}

export default useDeadlineAuthorization;