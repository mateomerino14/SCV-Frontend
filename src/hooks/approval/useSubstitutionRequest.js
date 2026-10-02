import {useState, useEffect} from 'react';
import {requestSubstitution, getSubstitutionStatus, getSubstitutionCandidates} from '../../services/approval/substitutionService';

function useSubstitutionRequest(tripId) {
  const [request, setRequest] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [substituteId, setSubstituteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [withoutSection, setWithoutSection] = useState(false);

  // silent: actualizacion de fondo (sondeo), sin indicador de carga
  const load = async (silent = false) => {
    if (!tripId) {
      return;
    }
    if (!silent) {
      setLoading(true);
    }
    const data = await getSubstitutionStatus(tripId);
    if (!silent) {
      setLoading(false);
    }
    if (!data || data.error) {
      return;
    }
    setRequest(data);
  };

  useEffect(() => {
    load();
  }, [tripId]);

  // Mientras la solicitud espera respuesta del revisor, se consulta cada 30 segundos para
  // mostrar la aprobacion o el rechazo sin recargar la pagina
  const waitingResponse = request?.estado === 'PENDIENTE';
  useEffect(() => {
    if (!waitingResponse) {
      return undefined;
    }
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, [waitingResponse, tripId]);

  const openModal = async () => {
    setSubstituteId('');
    setShowModal(true);
    // Solo personas activas de la misma seccion (el backend excluye al propio usuario)
    const data = await getSubstitutionCandidates();
    if (!data.error) {
      setEmployees(data.candidatos || []);
      setWithoutSection(!!data.sinSeccion);
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
  // Una solicitud cerrada por el sistema (sin revisor) no se muestra como rechazada
  const isClosed = request?.estado === 'RECHAZADA';
  const isRejected = isClosed && !!request?.id_revisor;
  const canRequest = !request || isClosed;

  return {
    withoutSection,
    request, employees, substituteId, setSubstituteId, loading, submitting, modalError,
    showModal, openModal, closeModal: () => setShowModal(false),
    isPending, isApproved, isRejected, canRequest,
    handleRequest, reload: load,
  };
}

export default useSubstitutionRequest;
