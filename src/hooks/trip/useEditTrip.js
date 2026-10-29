import {useState, useEffect} from 'react';
import {getTripDetail, editTrip} from '../../services/trip/tripService';
import {maxTripReasonLength} from '../../constants/tripLimits';
import useTripLogistics, {companyVehicle} from './useTripLogistics';

const EDITABLE_STATUSES = ['BORRADOR', 'RECHAZADO'];

function useEditTrip(tripId, user) {
  const [reason, setReason] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('Nacional');
  const [transport, setTransport] = useState('Terrestre');
  const [originalStatus, setOriginalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const logistics = useTripLogistics(transport);
  const {loadLogistics} = logistics;

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      setLoadError('');
      const data = await getTripDetail(tripId);
      setLoadingData(false);
      if (data.error || !data.viaje) {
        setLoadError(data.error || 'No se pudo cargar el viaje');
        return;
      }
      const trip = data.viaje;
      if (!EDITABLE_STATUSES.includes(trip.estado)) {
        setLoadError('Este viaje ya no se puede editar en su estado actual');
        return;
      }
      setReason(trip.motivo || '');
      setOrigin(trip.origen || '');
      setDestination(trip.destino || '');
      setStartDate(trip.fecha_inicio || '');
      setEndDate(trip.fecha_fin || '');
      setType(trip.tipo || 'Nacional');
      setTransport(trip.transporte || 'Terrestre');
      loadLogistics(trip);
      setOriginalStatus(trip.estado || null);
    };
    load();
  }, [tripId, loadLogistics]);

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
  const totalAmount = nationalDays * dailyRate;
  const totalAmountUsd = internationalDays * dailyRateUsd;

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
    return {...errors, ...logistics.validateLogistics()};
  };

  const handleSave = async (onSuccess) => {
    if (loadError || !originalStatus) {
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    const data = await editTrip(tripId, {
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
    setLoading(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    reason, origin, destination,
    startDate, endDate,
    type, setType, handleTypeChange,
    transport, setTransport,
    logistics,
    days, nationalDays, internationalDays,
    totalAmount, totalAmountUsd,
    dailyRate, dailyRateUsd,
    originalStatus,
    loading, loadingData, loadError, error, fieldErrors,
    handleReasonChange, handleOriginChange, handleDestinationChange,
    handleStartDateChange, handleEndDateChange,
    handleSave,
  };
}

export default useEditTrip;