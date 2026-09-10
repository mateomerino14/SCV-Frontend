import {useState, useEffect} from 'react';
import {
  getTripReviewDetail,
  approveTripReview,
  rejectTripReview,
  addTripReviewComment,
  editTripReviewComment,
  deleteTripReviewComment,
} from '../../services/approval/approverService';

function useApproverTripReviewDetail(tripId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
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
    const load = async () => {
      setLoading(true);
      const result = await getTripReviewDetail(tripId);
      setLoading(false);
      if (result.error) {
        setBlocked(true);
        setError(result.error);
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

  const handleApprove = async () => {
    setSavingAction(true);
    const result = await approveTripReview(tripId);
    setSavingAction(false);
    setShowApprove(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setActionCompleted('APROBADO_APROBADOR');
  };

  const handleRequestReject = () => {
    const observationComments = data?.comentarios?.filter((comment) => comment.tipo === 'OBSERVACION') || [];
    if (observationComments.length === 0) {
      setShowNoObservations(true);
      return;
    }
    setShowReject(true);
  };

  const handleReject = async () => {
    setSavingAction(true);
    const result = await rejectTripReview(tripId);
    setSavingAction(false);
    setShowReject(false);
    if (result.error) {
      showError(result.error);
      return;
    }
    setActionCompleted('RECHAZADO');
  };

  const handleAddComment = async () => {
    const texts = observations.filter((text) => text.trim());
    if (texts.length === 0) {
      return;
    }
    setSavingAction(true);
    for (const text of texts) {
      await addTripReviewComment(tripId, text);
    }
    setSavingAction(false);
    setCommentAdded(true);
    setObservations(['']);
    const result = await getTripReviewDetail(tripId);
    if (!result.error) {
      setData(result);
    }
  };

  const resetCommentAdded = () => setCommentAdded(false);

  const editObservation = (index, value) => {
    setObservations((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleOpenEdit = (comment) => {
    setEditingComment(comment.id_comentario);
    setEditText(comment.descripcion);
  };

  const handleConfirmEdit = async () => {
    setSavingAction(true);
    const result = await editTripReviewComment(tripId, editingComment, editText);
    setSavingAction(false);
    if (result.error) {
      showError(result.error);
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
      showError(result.error);
      return;
    }
    setDeletingComment(null);
    const updated = await getTripReviewDetail(tripId);
    if (!updated.error) {
      setData(updated);
    }
  };

  return {
    data, loading, savingAction, error, blocked,
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
    handleAddComment,
    handleOpenEdit, handleConfirmEdit,
    handleOpenDelete, handleConfirmDelete,
    editObservation,
  };
}

export default useApproverTripReviewDetail;