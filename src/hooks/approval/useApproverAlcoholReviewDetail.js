import {useState, useEffect} from 'react';
import {
  getAlcoholReviewDetail,
  approveAlcoholReview,
  rejectAlcoholReview,
  addAlcoholReviewComment,
  editAlcoholReviewComment,
  deleteAlcoholReviewComment,
  returnAlcoholReview,
  takeAlcoholReview,
} from '../../services/approval/approverAlcoholReviewService';

function useApproverAlcoholReviewDetail(tripId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showNoObservations, setShowNoObservations] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(null);
  const [commentAdded, setCommentAdded] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [activeExpense, setActiveExpense] = useState(null);
  const [showExpenseObservations, setShowExpenseObservations] = useState(false);
  const [newText, setNewText] = useState('');
  const [taking, setTaking] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    const load = async () => {
      setLoading(true);
      const result = await getAlcoholReviewDetail(tripId);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        setBlocked(true);
        return;
      }
      setData(result);
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
    const updated = await getAlcoholReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  const handleTake = async () => {
    setTaking(true);
    const result = await takeAlcoholReview(tripId);
    setTaking(false);
    if (result.error) {
      if (result.error.includes('ya fue tomado') || result.error.includes('siendo revisado')) {
        setAlreadyTaken(true);
      }
      else {
        showError(result.error);
      }
      await reload();
      return;
    }
    await reload();
  };

  const closeAlreadyTakenModal = () => setAlreadyTaken(false);

  const handleApprove = async () => {
    setSavingAction(true);
    const result = await approveAlcoholReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setShowApprove(false);
    setActionCompleted('APROBADO');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'APROBADO_SUPERVISOR'}}));
  };
  
  const currentCycle = () => data?.viaje?.ciclo_revision || 1;

  const handleRequestReject = () => {
    const savedObservations = (data?.comentarios || []).filter((comment) =>
      comment.tipo === 'OBSERVACION' &&
      (comment.ciclo_revision || 1) === currentCycle() &&
      comment.id_gasto != null
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
    const result = await rejectAlcoholReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setShowReject(false);
    setActionCompleted('RECHAZADO');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'RECHAZADO'}}));
  };

  const handleReturn = async () => {
    const result = await returnAlcoholReview(tripId);
    if (result.error) {
      showError(result.error);
      return;
    }
    window.history.back();
  };

  const openExpenseObservations = (expenseId) => {
    setActiveExpense(expenseId);
    setNewText('');
    setShowExpenseObservations(true);
  };

  const closeExpenseObservations = () => {
    setShowExpenseObservations(false);
    setActiveExpense(null);
    setNewText('');
  };

  const activeExpenseObservations = () => {
    if (!activeExpense || !data?.comentarios) {
      return [];
    }
    return data.comentarios.filter((comment) => comment.tipo === 'OBSERVACION' && comment.id_gasto === activeExpense);
  };

  const countExpenseObservations = (expenseId) => {
    if (!data?.comentarios) {
      return 0;
    }
    return data.comentarios.filter((comment) => comment.tipo === 'OBSERVACION' && comment.id_gasto === expenseId).length;
  };

  const handleAddComment = async () => {
    const text = newText.trim();
    if (!text) {
      showModalError('Debes escribir una observación');
      return;
    }
    setSavingAction(true);
    const result = await addAlcoholReviewComment(tripId, text, activeExpense);
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setNewText('');
    setCommentAdded(true);
    await reload();
  };

  const handleOpenEdit = (comment) => {
    setEditingComment(comment.id_comentario);
    setEditText(comment.descripcion);
  };

  const handleConfirmEdit = async () => {
    if (!editText.trim()) {
      showModalError('El comentario no puede estar vacío');
      return;
    }
    setSavingAction(true);
    const result = await editAlcoholReviewComment(tripId, editingComment, editText);
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
    const result = await deleteAlcoholReviewComment(tripId, deletingComment);
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setDeletingComment(null);
    await reload();
  };

  const resetCommentAdded = () => setCommentAdded(false);

  return {
    data, loading, savingAction, error, modalError, blocked,
    showApprove, setShowApprove,
    showReject, setShowReject,
    showNoObservations, setShowNoObservations,
    actionCompleted,
    commentAdded, resetCommentAdded,
    editingComment, setEditingComment,
    deletingComment, setDeletingComment,
    editText, setEditText,
    activeExpense, showExpenseObservations, newText, setNewText,
    openExpenseObservations, closeExpenseObservations,
    activeExpenseObservations, countExpenseObservations,
    taking, handleTake, alreadyTaken, closeAlreadyTakenModal,
    handleApprove,
    handleRequestReject,
    handleReject,
    handleReturn,
    handleAddComment,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
  };
}

export default useApproverAlcoholReviewDetail;