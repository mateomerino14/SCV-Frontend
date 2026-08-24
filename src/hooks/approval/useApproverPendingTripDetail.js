import {useState, useEffect} from 'react';
import {
  getTripReviewDetail,
  approveTripReview,
  rejectTripReview,
  addTripReviewComment,
  editTripReviewComment,
  deleteTripReviewComment,
} from '../../services/approval/approverService';

function useApproverPendingTripDetail(tripId) {
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
  const [observations, setObservations] = useState(['']);
  const [commentAdded, setCommentAdded] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!tripId) {
      return;
    }
    const load = async () => {
      setLoading(true);
      const result = await getTripReviewDetail(tripId);
      setLoading(false);
      if (result.error) {
        if (result.error.includes('siendo revisado')) {
          setBlocked(true);
          setError(result.error);
        }
        else {
          setError(result.error);
        }
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

  const handleApprove = async () => {
    setShowApprove(false);
    setSavingAction(true);
    const result = await approveTripReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setActionCompleted('EN_CURSO');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'EN_CURSO'}}));
  };

  const handleRequestReject = () => {
    const savedObservations = (data?.comentarios || []).filter((comment) => comment.tipo === 'OBSERVACION');
    if (savedObservations.length === 0) {
      setShowNoObservations(true);
      return;
    }
    setShowReject(true);
  };

  const handleReject = async () => {
    setShowReject(false);
    setSavingAction(true);
    const result = await rejectTripReview(tripId);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setActionCompleted('RECHAZADO');
    setData((prev) => ({...prev, viaje: {...prev.viaje, estado: 'RECHAZADO'}}));
  };

  const handleAddComment = async () => {
    const text = observations[0] || '';
    if (!text.trim()) {
      return;
    }
    setSavingAction(true);
    const result = await addTripReviewComment(tripId, text.trim());
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setCommentAdded(true);
    setObservations(['']);
    const updated = await getTripReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  const editObservation = (index, text) => {
    setObservations((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  };

  const resetCommentAdded = () => setCommentAdded(false);

  const handleOpenEdit = (comment) => {
    setEditingComment(comment.id_comentario);
    setEditText(comment.descripcion);
  };

  const handleConfirmEdit = async () => {
    if (!editText.trim()) {
      return;
    }
    setSavingAction(true);
    const result = await editTripReviewComment(tripId, editingComment, editText.trim());
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setEditingComment(null);
    setEditText('');
    const updated = await getTripReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  const handleOpenDelete = (commentId) => setDeletingComment(commentId);

  const handleConfirmDelete = async () => {
    setSavingAction(true);
    const result = await deleteTripReviewComment(tripId, deletingComment);
    setSavingAction(false);
    if (result.error) {
      showModalError(result.error);
      return;
    }
    setDeletingComment(null);
    const updated = await getTripReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  return {
    data, loading, savingAction, error, modalError, blocked,
    showApprove, setShowApprove,
    showReject, setShowReject,
    showNoObservations, setShowNoObservations,
    actionCompleted,
    observations,
    commentAdded, resetCommentAdded,
    editingComment, setEditingComment,
    deletingComment, setDeletingComment,
    editText, setEditText,
    handleApprove, handleRequestReject, handleReject,
    handleAddComment, editObservation,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
  };
}

export default useApproverPendingTripDetail;