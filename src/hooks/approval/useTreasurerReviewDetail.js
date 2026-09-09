import {useState, useEffect} from 'react';
import {
  getTripDetail,
  updateAmounts,
  approveTrip,
  rejectTrip,
  addTripComment,
  editTripComment,
  deleteTripComment,
} from '../../services/approval/treasurerService';
import getCurrentUserId from '../../utils/getCurrentUserId';

const maxAmount = 999999.99;

function useTreasurerReviewDetail(tripId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showNoObservations, setShowNoObservations] = useState(false);
  const [observations, setObservations] = useState(['']);
  const [actionCompleted, setActionCompleted] = useState(null);
  const [commentAdded, setCommentAdded] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [assignedAmount, setAssignedAmount] = useState('');
  const [assignedAmountUsd, setAssignedAmountUsd] = useState('');
  const [editingAmounts, setEditingAmounts] = useState(false);
  const [savingAmounts, setSavingAmounts] = useState(false);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    const load = async () => {
      setLoading(true);
      const result = await getTripDetail(tripId);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        setBlocked(true);
        return;
      }
      setData(result);
      setAssignedAmount(String(result.viaje.monto_asignado));
      setAssignedAmountUsd(String(result.viaje.monto_asignado_usd || 0));
    };
    load();
  }, [tripId]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const showModalError = (message) => {
    setModalError(message);
    setTimeout(() => setModalError(''), 3000);
  };

  const reload = async () => {
    const updated = await getTripDetail(tripId);
    if (!updated.error) {
      setData(updated);
      setAssignedAmount(String(updated.viaje.monto_asignado));
      setAssignedAmountUsd(String(updated.viaje.monto_asignado_usd || 0));
    }
  };

  const handleAssignedAmountChange = (value) => {
    if (value === '') {
      setAssignedAmount('');
      return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxAmount) {
      return;
    }
    setAssignedAmount(value);
  };

  const handleAssignedAmountUsdChange = (value) => {
    if (value === '') {
      setAssignedAmountUsd('');
      return;
    }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    if (parseFloat(value) > maxAmount) {
      return;
    }
    setAssignedAmountUsd(value);
  };

  const handleSaveAmounts = async () => {
    if (!assignedAmount || parseFloat(assignedAmount) < 0 || isNaN(parseFloat(assignedAmount))) {
      showError('El monto en Bs debe ser un número válido');
      return;
    }
    setSavingAmounts(true);
    const result = await updateAmounts(tripId, parseFloat(assignedAmount), parseFloat(assignedAmountUsd) || 0);
    setSavingAmounts(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setEditingAmounts(false);
    await reload();
  };

  const handleApprove = async () => {
    setSavingAction(true);
    const result = await approveTrip(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setShowApprove(false);
    setActionCompleted('EN_CURSO');
    setData((prev) => {
      if (prev) {
        return {...prev, viaje: {...prev.viaje, estado: 'EN_CURSO'}};
      }
      return prev;
    });
  };

  const handleRequestReject = () => {
    const currentUserId = getCurrentUserId();
    const currentCycle = data?.viaje?.ciclo_revision || 1;
    const savedObservations = (data?.comentarios || []).filter((comment) =>
      comment.tipo === 'OBSERVACION' &&
      comment.id_usuario === currentUserId &&
      (comment.ciclo_revision || 1) === currentCycle
    );
    if (savedObservations.length === 0) {
      setShowNoObservations(true);
    }
    else {
      setShowReject(true);
    }
  };

  const handleReject = async () => {
    setSavingAction(true);
    const result = await rejectTrip(tripId);
    setSavingAction(false);
    if (result.error) {
      setShowNoObservations(true);
      return;
    }
    setShowReject(false);
    setActionCompleted('RECHAZADO');
    setData((prev) => {
      if (prev) {
        return {...prev, viaje: {...prev.viaje, estado: 'RECHAZADO'}};
      }
      return prev;
    });
  };

  const handleAddComment = async () => {
    const text = observations[0]?.trim();
    if (!text) {
      showError('Debes escribir una observación');
      return;
    }
    setSavingAction(true);
    const result = await addTripComment(tripId, text);
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setObservations(['']);
    setCommentAdded(true);
    await reload();
  };

  const handleOpenEdit = (comment) => {
    setEditingComment(comment.id_comentario);
    setEditText(comment.descripcion);
  };

  const handleConfirmEdit = async () => {
    if (!editText.trim()) {
      showError('El comentario no puede estar vacío');
      return;
    }
    setSavingAction(true);
    const result = await editTripComment(tripId, editingComment, editText);
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setEditingComment(null);
    setEditText('');
    await reload();
  };

  const handleOpenDelete = (commentId) => setDeletingComment(commentId);

  const handleConfirmDelete = async () => {
    setSavingAction(true);
    const result = await deleteTripComment(tripId, deletingComment);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setDeletingComment(null);
    await reload();
  };

  const resetCommentAdded = () => setCommentAdded(false);

  const editObservation = (index, value) => {
    setObservations((prev) => prev.map((observation, i) => {
      if (i === index) {
        return value;
      }
      return observation;
    }));
  };

  return {
    data, loading, savingAction, error, modalError, blocked,
    showApprove, setShowApprove,
    showReject, setShowReject,
    showNoObservations, setShowNoObservations,
    observations,
    actionCompleted,
    commentAdded, resetCommentAdded,
    editingComment, setEditingComment,
    deletingComment, setDeletingComment,
    editText, setEditText,
    assignedAmount, setAssignedAmount,
    assignedAmountUsd, setAssignedAmountUsd,
    handleAssignedAmountChange, handleAssignedAmountUsdChange,
    editingAmounts, setEditingAmounts,
    savingAmounts, handleSaveAmounts,
    handleApprove,
    handleRequestReject,
    handleReject,
    handleAddComment,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
    editObservation,
  };
}

export default useTreasurerReviewDetail;