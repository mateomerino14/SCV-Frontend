import {useState, useEffect} from 'react';
import {requestSubstitution, getSubstitutionStatus} from '../../services/approval/substitutionService';
import {getEmployees} from '../../services/user/userService';

function useSubstitutionRequest(tripId) {
  const [request, setRequest] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    if (!tripId) {
      return;
    }
    setLoading(true);
    const data = await getSubstitutionStatus(tripId);
    setLoading(false);
    if (!data || data.error) {
      return;
    }
    setRequest(data);
  };

  useEffect(() => {
    load();
  }, [tripId]);

  const openModal = async () => {
    setShowModal(true);
    if (employees.length === 0) {
      const data = await getEmployees();
      if (!data.error) {
        setEmployees(data);
      }
    }
  };

  const showModalError = (message) => {
    setModalError(message);
    setTimeout(() => setModalError(''), 4000);
  };

  const handleRequest = async (substituteId) => {
    if (!substituteId) {
      showModalError('Debes seleccionar quién rendirá por ti');
      return false;
    }
    setSubmitting(true);
    const data = await requestSubstitution(tripId, substituteId);
    setSubmitting(false);
    if (!data || data.error) {
      showModalError(data?.error || 'Ocurrió un error, intenta nuevamente');
      return false;
    }
    setShowModal(false);
    await load();
    return true;
  };

  const isPending = request?.estado === 'PENDIENTE';
  const isApproved = request?.estado === 'APROBADA';
  const isRejected = request?.estado === 'RECHAZADA';
  const canRequest = !request || isRejected;

  return {
    request, employees, loading, submitting, modalError,
    showModal, openModal, closeModal: () => setShowModal(false),
    isPending, isApproved, isRejected, canRequest,
    handleRequest, reload: load,
  };
}

export default useSubstitutionRequest;
