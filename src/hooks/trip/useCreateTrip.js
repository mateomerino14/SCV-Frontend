import {useState} from 'react';
import {createTrip, submitTripForReview} from '../../services/trip/tripService';
import {maxTripReasonLength} from '../../constants/tripLimits';
import useTripLogistics, {companyVehicle} from './useTripLogistics';
import useTreasurerTripAmount from './useTreasurerTripAmount';

const draftSavedMessage = 'Se registró el viaje como borrador';
const sentToReviewMessage = 'Se registró el viaje y se envió a revisión';

function useCreateTrip(user) {
  const [reason, setReason] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('Nacional');
  const [transport, setTransport] = useState('Terrestre');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdMessage, setCreatedMessage] = useState(draftSavedMessage);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const logistics = useTripLogistics(transport);
  const dailyRate = parseFloat(user?.Cargo?.monto_diario ?? 0);
  const dailyRateUsd = parseFloat(user?.Cargo?.monto_diario_usd ?? 0);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'Internacional' && transport === companyVehicle) {
      setTransport('Terrestre');
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) {
      return 0;
    }
    const [y1, m1, d1] = startDate.split('-');
    const [y2, m2, d2] = endDate.split('-');
    const start = new Date(y1, m1 - 1, d1);
    const end = new Date(y2, m2 - 1, d2);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    if (diff > 0) {
      return diff + 1;
    }
    return 0;
  };

  const days = calculateDays();
  let nationalDays = days;
  let internationalDays = 0;
  if (type === 'Internacional') {
    nationalDays = Math.min(days, 2);
    internationalDays = Math.max(0, days - 2);
  }
  const calculatedAmount = nationalDays * dailyRate;
  const calculatedAmountUsd = internationalDays * dailyRateUsd;
  const treasurerAmount = useTreasurerTripAmount(calculatedAmount, calculatedAmountUsd);
  const totalAmount = treasurerAmount.finalBs;
  const totalAmountUsd = treasurerAmount.finalUsd;

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleReasonChange = (value) => {
    if (value.length > maxTripReasonLength) {
      return;
    }
    setReason(value);
    setFieldErrors((prev) => ({...prev, reason: undefined}));
  };

  const handleOriginChange = (value) => {
    if (value.length > 200) {
      return;
    }
    setOrigin(value);
    setFieldErrors((prev) => ({...prev, origin: undefined}));
  };

  const handleDestinationChange = (value) => {
    if (value.length > 200) {
      return;
    }
    setDestination(value);
    setFieldErrors((prev) => ({...prev, destination: undefined}));
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setFieldErrors((prev) => ({...prev, startDate: undefined}));
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setFieldErrors((prev) => ({...prev, endDate: undefined}));
  };

  const validate = () => {
    const errors = {};
    if (!reason.trim()) {
      errors.reason = 'El motivo del viaje es requerido';
    }
    if (!origin.trim()) {
      errors.origin = 'El origen es requerido';
    }
    if (!destination.trim()) {
      errors.destination = 'El destino es requerido';
    }
    if (!startDate) {
      errors.startDate = 'La fecha de inicio es requerida';
    }
    if (!endDate) {
      errors.endDate = 'La fecha de fin es requerida';
    }
    if (startDate && endDate && calculateDays() <= 0) {
      errors.endDate = 'La fecha fin debe ser posterior a la fecha de inicio';
    }
    return {...errors, ...logistics.validateLogistics(), ...treasurerAmount.validateAmount(type === 'Internacional')};
  };

  const isValid = () => {
    const errors = validate();
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setReason('');
    setOrigin('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setType('Nacional');
    setTransport('Terrestre');
    logistics.resetLogistics();
    treasurerAmount.resetToCalculated();
  };

  const saveTrip = async (sendToReview) => {
    setLoading(true);
    const data = await createTrip({
      motivo: reason.trim(),
      origen: origin.trim(),
      destino: destination.trim(),
      fecha_inicio: startDate,
      fecha_fin: endDate,
      tipo: type,
      transporte: transport,
      monto_asignado: totalAmount + logistics.fuelValue,
      monto_asignado_usd: totalAmountUsd,
      ...logistics.logisticsPayload(),
    });
    if (data.error) {
      setLoading(false);
      showError(data.error);
      return;
    }
    let message = draftSavedMessage;
    if (sendToReview) {
      const submitted = await submitTripForReview(data.id_viaje);
      message = sentToReviewMessage;
      if (submitted.error) {
        message = `${draftSavedMessage}, pero no se pudo enviar a revisión: ${submitted.error}. Puedes enviarlo desde el borrador.`;
      }
    }
    setLoading(false);
    setCreatedMessage(message);
    setShowConfirmation(true);
    resetForm();
  };

  const handleSaveDraft = async () => {
    if (isValid()) {
      await saveTrip(false);
    }
  };

  const handleRequestSubmit = () => {
    if (isValid()) {
      setShowSubmitConfirm(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirm(false);
    await saveTrip(true);
  };

  return {
    reason, origin, destination,
    startDate, endDate,
    type, setType, handleTypeChange,
    transport, setTransport,
    logistics, treasurerAmount,
    days, nationalDays, internationalDays,
    totalAmount, totalAmountUsd,
    dailyRate, dailyRateUsd,
    loading, error, fieldErrors,
    showConfirmation, setShowConfirmation, createdMessage,
    showSubmitConfirm, setShowSubmitConfirm, handleRequestSubmit, handleConfirmSubmit,
    handleReasonChange,
    handleOriginChange,
    handleDestinationChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSaveDraft,
  };
}

export default useCreateTrip;