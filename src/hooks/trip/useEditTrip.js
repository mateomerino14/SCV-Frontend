import {useState, useEffect} from 'react';
import {getTripDetail, editTrip} from '../../services/trip/tripService';

function useEditTrip(tripId, user) {
  const [reason, setReason] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('Nacional');
  const [transport, setTransport] = useState('Terrestre');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [originalStatus, setOriginalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      const data = await getTripDetail(tripId);
      setLoadingData(false);
      if (data.error) {
        return;
      }
      const trip = data.viaje;
      setReason(trip.motivo || '');
      setOrigin(trip.origen || '');
      setDestination(trip.destino || '');
      setStartDate(trip.fecha_inicio || '');
      setEndDate(trip.fecha_fin || '');
      setType(trip.tipo || 'Nacional');
      setTransport(trip.transporte || 'Terrestre');
      setVehiclePlate(trip.placa_vehiculo || '');
      setOriginalStatus(trip.estado || null);
    };
    load();
  }, [tripId]);

  const dailyRate = parseFloat(user?.Cargo?.monto_diario ?? 0);
  const dailyRateUsd = parseFloat(user?.Cargo?.monto_diario_usd ?? 0);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'Internacional' && transport === 'Vehículo de Empresa') {
      setTransport('Terrestre');
      setVehiclePlate('');
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
    if (value.length > 100) {
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

  const handleVehiclePlateChange = (value) => {
    if (value.length > 20) {
      return;
    }
    setVehiclePlate(value);
    setFieldErrors((prev) => ({...prev, vehiclePlate: undefined}));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError('Tu navegador no permite obtener la ubicación actual');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {latitude, longitude} = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
          );
          const data = await response.json();
          const address = data?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          if (address.length > 200) {
            setOrigin(address.slice(0, 200));
          }
          else {
            setOrigin(address);
          }
          setFieldErrors((prev) => ({...prev, origin: undefined}));
        }
        catch {
          showError('No se pudo obtener la dirección de tu ubicación actual');
        }
        finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        showError('No se pudo acceder a tu ubicación. Revisa los permisos del navegador.');
      }
    );
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
    if (transport === 'Vehículo de Empresa' && !vehiclePlate.trim()) {
      errors.vehiclePlate = 'La placa del vehículo es requerida';
    }
    return errors;
  };

  const handleSave = async (onSuccess) => {
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
      placa_vehiculo: transport === 'Vehículo de Empresa' ? vehiclePlate.trim() : null,
      monto_asignado: totalAmount,
      monto_asignado_usd: totalAmountUsd,
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
    vehiclePlate, handleVehiclePlateChange,
    days, nationalDays, internationalDays,
    totalAmount, totalAmountUsd,
    dailyRate, dailyRateUsd,
    originalStatus,
    loading, loadingData, error, fieldErrors,
    loadingLocation,
    handleReasonChange, handleOriginChange, handleDestinationChange,
    handleStartDateChange, handleEndDateChange,
    handleUseCurrentLocation,
    handleSave,
  };
}

export default useEditTrip;