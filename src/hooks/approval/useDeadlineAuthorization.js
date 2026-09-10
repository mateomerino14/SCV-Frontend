import {useState, useEffect} from 'react';
import {requestAuthorization, getRequestStatus} from '../../services/approval/deadlineAuthorizationService';

const toleranceDays = 4;

function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isDeadlineExpired(fechaFin) {
  if (!fechaFin) {
    return false;
  }
  const today = getLocalToday();
  const end = new Date(`${fechaFin}T00:00:00`);
  end.setDate(end.getDate() + toleranceDays);
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  const toleranceEnd = `${year}-${month}-${day}`;
  return today > toleranceEnd;
}

function useDeadlineAuthorization(tripId, fechaFin, tripInProgress) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showExpiredNotice, setShowExpiredNotice] = useState(false);
  const [noticeShown, setNoticeShown] = useState(false);

  const load = async () => {
    if (!tripId) {
      return;
    }
    setLoading(true);
    const data = await getRequestStatus(tripId);
    setLoading(false);
    if (!data || data.error) {
      return;
    }
    setRequest(data);
  };

  useEffect(() => {
    load();
  }, [tripId]);

  const deadlineExpired = fechaFin ? isDeadlineExpired(fechaFin) : true;
  const isPending = request?.estado === 'PENDIENTE';
  const isRejected = request?.estado === 'RECHAZADA';
  const isApprovedActive = request?.estado === 'APROBADA' && !request?.extension_vencida;
  const isApprovedExpired = request?.estado === 'APROBADA' && !!request?.extension_vencida;
  const canRequest = deadlineExpired && (!request || isRejected || isApprovedExpired);

  useEffect(() => {
    if (loading || noticeShown || !fechaFin || !tripInProgress) {
      return;
    }
    if (deadlineExpired && !isPending && !isApprovedActive) {
      setShowExpiredNotice(true);
      setNoticeShown(true);
    }
  }, [loading, deadlineExpired, isPending, isApprovedActive, fechaFin, tripInProgress, noticeShown]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const showModalError = (message) => {
    setModalError(message);
    setTimeout(() => setModalError(''), 4000);
  };

  const handleRequest = async (reason) => {
    if (!reason.trim()) {
      showModalError('Debes indicar el motivo del retraso');
      return false;
    }
    setSubmitting(true);
    const data = await requestAuthorization(tripId, reason.trim());
    setSubmitting(false);
    if (!data || data.error) {
      showModalError(data?.error || 'Ocurrió un error, intenta nuevamente');
      return false;
    }
    setShowModal(false);
    await load();
    return true;
  };

  const closeExpiredNotice = () => setShowExpiredNotice(false);

  return {
    request, loading, submitting, error, modalError,
    showModal, setShowModal,
    showExpiredNotice, closeExpiredNotice,
    isPending, isApproved: isApprovedActive, isRejected, isApprovedExpired,
    deadlineExpired, canRequest,
    handleRequest, reload: load,
  };
}

export default useDeadlineAuthorization;