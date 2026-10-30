import {useState, useEffect} from 'react';
import {getVehicles, createVehicle, updateVehicle, suspendVehicle, activateVehicle} from '../../services/admin/adminService';

const maxPlate = 20;
const maxDescription = 100;
const emptyForm = {placa: '', descripcion: ''};

const normalizePlate = (plate) => (plate || '').trim().replace(/\s+/g, ' ').toUpperCase();

function useVehicleManagement() {
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const load = async () => {
    const data = await getVehicles();
    setLoading(false);
    if (!data.error) {
      setAllVehicles(data);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getVehicles().then((data) => {
      if (cancelled) {
        return;
      }
      setLoading(false);
      if (!data.error) {
        setAllVehicles(data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const vehicles = allVehicles.filter((vehicle) => `${vehicle.placa} ${vehicle.descripcion || ''}`.toLowerCase().includes(normalizedSearch));

  const validateFields = () => {
    const errors = {};
    const plate = normalizePlate(formData.placa);
    if (!plate) {
      errors.placa = 'La placa del vehículo es requerida';
    }
    else if (plate.length > maxPlate) {
      errors.placa = `Máximo ${maxPlate} caracteres`;
    }
    else if (allVehicles.some((vehicle) => vehicle.placa === plate && vehicle.id_vehiculo !== selectedVehicle?.id_vehiculo)) {
      errors.placa = 'Ya existe un vehículo con esa placa';
    }
    if (formData.descripcion.trim().length > maxDescription) {
      errors.descripcion = `Máximo ${maxDescription} caracteres`;
    }
    return errors;
  };

  const openCreate = () => {
    setSelectedVehicle(null);
    setFormData(emptyForm);
    setError('');
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({placa: vehicle.placa, descripcion: vehicle.descripcion || ''});
    setError('');
    setFieldErrors({});
    setShowForm(true);
  };

  const openSuspend = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowSuspend(true);
  };

  const finish = async (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    await load();
  };

  const handleSave = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSavingAction(true);
    const payload = {placa: normalizePlate(formData.placa), descripcion: formData.descripcion.trim()};
    let data;
    if (selectedVehicle) {
      data = await updateVehicle(selectedVehicle.id_vehiculo, payload);
    }
    else {
      data = await createVehicle(payload);
    }
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowForm(false);
    if (selectedVehicle) {
      await finish('Vehículo actualizado correctamente');
    }
    else {
      await finish('Vehículo registrado correctamente');
    }
  };

  const handleToggleActive = async () => {
    setSavingAction(true);
    let data;
    if (selectedVehicle.activo) {
      data = await suspendVehicle(selectedVehicle.id_vehiculo);
    }
    else {
      data = await activateVehicle(selectedVehicle.id_vehiculo);
    }
    setSavingAction(false);
    setShowSuspend(false);
    if (data.error) {
      setSuccessMessage(data.error);
      setShowSuccess(true);
      return;
    }
    if (selectedVehicle.activo) {
      await finish('Vehículo suspendido: ya no se ofrece al crear viajes');
    }
    else {
      await finish('Vehículo activado');
    }
  };

  return {
    vehicles, allVehicles, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, selectedVehicle,
    showForm, setShowForm, showSuspend, setShowSuspend, showSuccess, setShowSuccess, successMessage,
    formData, setFormData,
    openCreate, openEdit, openSuspend, handleSave, handleToggleActive,
  };
}

export default useVehicleManagement;
