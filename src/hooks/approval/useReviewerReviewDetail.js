import {useState, useEffect} from 'react';
import {
  getReviewDetail,
  approveReview,
  rejectReview,
  addReviewComment,
  editReviewComment,
  deleteReviewComment,
} from '../../services/approval/reviewerService';

function useReviewerReviewDetail(tripId) {
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
      const result = await getReviewDetail(tripId);
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

  const currentCycle = () => data?.viaje?.ciclo_revision || 1;

  const handleApprove = async () => {
    setSavingAction(true);
    const result = await approveReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setShowApprove(false);
    setActionCompleted('APROBADO_FINAL');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'APROBADO_FINAL'}}));
  };

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
    const result = await rejectReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setShowReject(false);
    setActionCompleted('RECHAZADO');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'RECHAZADO'}}));
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
    const result = await addReviewComment(tripId, text, activeExpense);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setNewText('');
    setCommentAdded(true);
    const updated = await getReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
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
    const result = await editReviewComment(tripId, editingComment, editText);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setEditingComment(null);
    setEditText('');
    const updated = await getReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  const handleOpenDelete = (commentId) => setDeletingComment(commentId);

  const handleConfirmDelete = async () => {
    setSavingAction(true);
    const result = await deleteReviewComment(tripId, deletingComment);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setDeletingComment(null);
    const updated = await getReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
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
    handleAddComment,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
  };
}

export default useReviewerReviewDetail;