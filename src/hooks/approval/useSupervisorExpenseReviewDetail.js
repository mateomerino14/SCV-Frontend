import {useState, useEffect} from 'react';
import {
  getExpenseReviewDetail,
  approveExpenseReview,
  rejectExpenseReview,
  addExpenseReviewComment,
  editExpenseReviewComment,
  deleteExpenseReviewComment,
  returnExpenseReview,
} from '../../services/approval/reviewService';

function useSupervisorExpenseReviewDetail(tripId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
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

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const load = async () => {
      setLoading(true);
      const result = await getExpenseReviewDetail(tripId);
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

  const reload = async () => {
    const updated = await getExpenseReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  const handleApprove = async () => {
    setSavingAction(true);
    const result = await approveExpenseReview(tripId);
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
    const result = await rejectExpenseReview(tripId);
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
    const result = await returnExpenseReview(tripId);
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
      showError('Debes escribir una observación');
      return;
    }
    setSavingAction(true);
    const result = await addExpenseReviewComment(tripId, text, activeExpense);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
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
      showError('El comentario no puede estar vacío');
      return;
    }
    setSavingAction(true);
    const result = await editExpenseReviewComment(tripId, editingComment, editText);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setEditingComment(null);
    setEditText('');
    await reload();
  };

  const handleOpenDelete = (commentId) => setDeletingComment(commentId);

  const handleConfirmDelete = async () => {
    setSavingAction(true);
    const result = await deleteExpenseReviewComment(tripId, deletingComment);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setDeletingComment(null);
    await reload();
  };

  const resetCommentAdded = () => setCommentAdded(false);

  return {
    data, loading, savingAction, error, blocked,
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
    handleApprove,
    handleRequestReject,
    handleReject,
    handleReturn,
    handleAddComment,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
  };
}

export default useSupervisorExpenseReviewDetail;