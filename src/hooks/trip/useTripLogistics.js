import {useState, useCallback} from 'react';

export const companyVehicle = 'Vehículo de Empresa';
export const lodgingOptions = [{value: 'Empresa', label: 'Empresa'}, {value: 'Propio', label: 'Propio'}];

function useTripLogistics(transport) {
  const [lodging, setLodging] = useState('Propio');
  const [vehicleId, setVehicleId] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [logisticsErrors, setLogisticsErrors] = useState({});
  const usesCompanyVehicle = transport === companyVehicle;
  let fuelValue = 0;
  if (usesCompanyVehicle) {
    fuelValue = parseFloat(fuelAmount) || 0;
  }

  const handleVehicleChange = (value) => {
    setVehicleId(value);
    setLogisticsErrors((prev) => ({...prev, vehicle: undefined}));
  };

  const handleFuelChange = (value) => {
    if (String(value).length > 9 || !/^\d*\.?\d{0,2}$/.test(String(value))) {
      return;
    }
    setFuelAmount(value);
    setLogisticsErrors((prev) => ({...prev, fuel: undefined}));
  };

  const validateLogistics = () => {
    const errors = {};
    if (usesCompanyVehicle && !vehicleId) {
      errors.vehicle = 'Elige el vehículo de la empresa';
    }
    if (usesCompanyVehicle && fuelAmount !== '' && (isNaN(parseFloat(fuelAmount)) || parseFloat(fuelAmount) < 0)) {
      errors.fuel = 'El monto para combustible debe ser mayor o igual a cero';
    }
    setLogisticsErrors(errors);
    return errors;
  };

  const logisticsPayload = () => {
    let vehicle = null;
    if (usesCompanyVehicle) {
      vehicle = Number(vehicleId);
    }
    return {gestion_hospedaje: lodging, id_vehiculo: vehicle, monto_combustible: fuelValue};
  };

  const loadLogistics = useCallback((trip) => {
    setLodging(trip.gestion_hospedaje || 'Propio');
    setVehicleId(trip.id_vehiculo || '');
    if (parseFloat(trip.monto_combustible) > 0) {
      setFuelAmount(String(parseFloat(trip.monto_combustible)));
    }
    else {
      setFuelAmount('');
    }
  }, []);

  const resetLogistics = useCallback(() => {
    setLodging('Propio');
    setVehicleId('');
    setFuelAmount('');
    setLogisticsErrors({});
  }, []);

  return {
    lodging, setLodging, vehicleId, handleVehicleChange, fuelAmount, handleFuelChange, fuelValue, usesCompanyVehicle,
    logisticsErrors, validateLogistics, logisticsPayload, loadLogistics, resetLogistics,
  };
}

export default useTripLogistics;
