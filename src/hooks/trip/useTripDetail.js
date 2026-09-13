import {useState, useEffect} from 'react';
import {getTripDetail, confirmCompletion} from '../../services/trip/tripService';
import {deleteExpense} from '../../services/expense/expenseService';

function useTripDetail(tripId) {
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(false);
  const [error, setError] = useState('');
  const [exceededDays, setExceededDays] = useState([]);
  const [exceedsHotels, setExceedsHotels] = useState(false);
  const [dayJustifications, setDayJustifications] = useState({});
  const [observations, setObservations] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showAllNational, setShowAllNational] = useState(false);
  const [showAllInternational, setShowAllInternational] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);
  const [accumulatedExpense, setAccumulatedExpense] = useState(0);
  const [accumulatedExpenseUsd, setAccumulatedExpenseUsd] = useState(0);
  const [exceedsBudget, setExceedsBudget] = useState(false);
  const [exceedsBudgetUsd, setExceedsBudgetUsd] = useState(false);
  const [totalExceeds, setTotalExceeds] = useState(false);
  const [totalExceedsUsd, setTotalExceedsUsd] = useState(false);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    const loadDetail = async () => {
      setLoading(true);
      const data = await getTripDetail(tripId);
      setLoading(false);
      if (data.error) {
        const isSessionError = data.error.includes('Token inválido') || data.error.includes('token no proporcionado') || data.error.includes('suspendida');
        if (!isSessionError) {
          setError(data.error);
        }
        return;
      }
      setTrip(data.viaje);
      setExpenses(data.gastos);
      setAccumulatedExpense(data.gastoAcumulado || 0);
      setAccumulatedExpenseUsd(data.gastoAcumuladoUsd || 0);
      setExceedsBudget(!!data.excedePresupuesto);
      setExceedsBudgetUsd(!!data.excedePresupuestoUsd);
      setTotalExceeds(!!data.excedeTotal);
      setTotalExceedsUsd(!!data.excedeTotalUsd);
      setExceededDays(data.diasExcedidos || []);
      setExceedsHotels(!!data.excedeHoteles);
      if (data.comentarios && data.comentarios.length > 0) {
        const justifications = data.comentarios.filter((comment) => comment.tipo === 'JUSTIFICACION');
        const obs = data.comentarios.filter((comment) => comment.tipo === 'OBSERVACION');
        const justificationsByDay = {};
        justifications.forEach((comment) => {
          const key = comment.fecha_justificada || 'HOTEL';
          if (!justificationsByDay[key]) {
            justificationsByDay[key] = comment.descripcion;
          }
        });
        setDayJustifications(justificationsByDay);
        setObservations(obs);
      }
    };
    loadDetail();
  }, [tripId]);

  const nationalExpenses = expenses.filter((expense) => !expense.es_gasto_internacional);
  const internationalExpenses = expenses.filter((expense) => !!expense.es_gasto_internacional);
  let tripInProgress = false;
  if (trip) {
    tripInProgress = trip.estado === 'EN_CURSO' || (trip.estado === 'RECHAZADO' && !!trip.fue_iniciado);
  }
  let displayedNationalExpenses = nationalExpenses.slice(0, 3);
  if (showAllNational) {
    displayedNationalExpenses = nationalExpenses;
  }
  let displayedInternationalExpenses = internationalExpenses.slice(0, 3);
  if (showAllInternational) {
    displayedInternationalExpenses = internationalExpenses;
  }

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const setDayJustification = (key, text) => {
    setDayJustifications((prev) => ({...prev, [key]: text}));
  };

  const missingJustifications = () => {
    const missingDays = exceededDays.filter((day) => !dayJustifications[day.fecha]?.trim());
    const missingHotel = exceedsHotels && !dayJustifications.HOTEL?.trim();
    return {missingDays, missingHotel};
  };

  const handleRequestSubmitReview = () => {
    if (expenses.length === 0) {
      showError('El viaje debe tener por lo menos un gasto asociado para ser finalizado');
      return;
    }
    if (!tripInProgress) {
      showError('Solo se pueden finalizar viajes en curso o rechazados con gastos');
      return;
    }
    const {missingDays, missingHotel} = missingJustifications();
    if (missingDays.length > 0 || missingHotel) {
      showError('Debes justificar cada día que excede la cuota diaria, y el exceso en hoteles si corresponde');
      return;
    }
    setShowSubmitReviewModal(true);
  };

  const handleConfirmSubmitReview = async () => {
    setShowSubmitReviewModal(false);
    setSubmittingReview(true);
    const justificationsToSend = [];
    exceededDays.forEach((day) => {
      const text = dayJustifications[day.fecha]?.trim();
      if (text) {
        justificationsToSend.push({fecha: day.fecha, descripcion: text});
      }
    });
    const hotelText = dayJustifications.HOTEL?.trim();
    if (exceedsHotels && hotelText) {
      justificationsToSend.push({fecha: null, descripcion: hotelText});
    }
    const data = await confirmCompletion(tripId, justificationsToSend);
    setSubmittingReview(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setSubmitted(true);
    setTrip((prev) => ({...prev, estado: 'EN_REVISION'}));
  };

  const handleCancelSubmitReview = () => setShowSubmitReviewModal(false);

  const handleRequestDelete = (expenseId) => {
    setExpenseToDelete(expenseId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeletingExpense(true);
    const data = await deleteExpense(expenseToDelete);
    setDeletingExpense(false);
    setShowDeleteModal(false);
    setExpenseToDelete(null);
    if (data.error) {
      showError(data.error);
      return;
    }
    setExpenses((prev) => prev.filter((expense) => expense.id_gasto !== expenseToDelete));
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  return {
    trip,
    expenses,
    nationalExpenses,
    internationalExpenses,
    displayedNationalExpenses,
    displayedInternationalExpenses,
    accumulatedExpense,
    accumulatedExpenseUsd,
    exceedsBudget,
    exceedsBudgetUsd,
    totalExceeds,
    totalExceedsUsd,
    exceededDays,
    exceedsHotels,
    dayJustifications, setDayJustification,
    tripInProgress,
    loading,
    submittingReview,
    deletingExpense,
    error,
    observations,
    submitted,
    showAllNational, setShowAllNational,
    showAllInternational, setShowAllInternational,
    showDeleteModal,
    showSubmitReviewModal,
    handleRequestSubmitReview,
    handleConfirmSubmitReview,
    handleCancelSubmitReview,
    handleRequestDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
}

export default useTripDetail;