import {useState, useEffect} from 'react';
import {getPositions, createPosition, updatePosition, suspendPosition, activatePosition} from '../../services/admin/adminService';

const maxName = 100;

function normalizePositionName(name) {
  return (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
}

function usePositionManagement() {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({nombre: '', tipo_viatico: ''});

  const applyPositions = (data) => {
    setLoading(false);
    if (!data.error) {
      setAllPositions(data);
    }
  };

  const load = async () => {
    setLoading(true);
    applyPositions(await getPositions());
  };

  useEffect(() => {
    getPositions().then(applyPositions);
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const filteredPositions = allPositions.filter((position) =>
    position.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const suggestions = formData.nombre.length >= 2
    ? allPositions.filter((position) => {
        const matchesSearch = position.nombre.toLowerCase().includes(formData.nombre.toLowerCase());
        if (selectedPosition) {
          return matchesSearch && position.id_cargo !== selectedPosition.id_cargo;
        }
        return matchesSearch;
      })
    : [];

  const positionAlreadyExists = (name, excludeId = null) => {
    const normalizedName = normalizePositionName(name);
    return allPositions.some((position) => {
      const sameName = normalizePositionName(position.nombre) === normalizedName;
      if (excludeId) {
        return sameName && position.id_cargo !== excludeId;
      }
      return sameName;
    });
  };

  const validateFields = (excludeId = null) => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del cargo es requerido';
    }
    else if (formData.nombre.trim().length > maxName) {
      errors.nombre = `Máximo ${maxName} caracteres`;
    }
    else if (positionAlreadyExists(formData.nombre.trim(), excludeId)) {
      errors.nombre = 'Ya existe un cargo con ese nombre';
    }
    if (!formData.tipo_viatico) {
      errors.tipo_viatico = 'Elige el tipo de la escala de viáticos';
    }
    return errors;
  };

  const openCreate = () => {
    setFormData({nombre: '', tipo_viatico: ''});
    setError('');
    setFieldErrors({});
    setShowCreate(true);
  };

  const openEdit = (position) => {
    setSelectedPosition(position);
    setFormData({nombre: position.nombre, tipo_viatico: position.tipo_viatico || ''});
    setError('');
    setFieldErrors({});
    setShowEdit(true);
  };

  const openSuspend = (position) => {
    setSelectedPosition(position);
    setShowSuspend(true);
  };

  const handleCreate = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSavingAction(true);
    const data = await createPosition({nombre: formData.nombre.trim(), tipo_viatico: formData.tipo_viatico});
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowCreate(false);
    setSuccessMessage('Cargo creado correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleEdit = async () => {
    const errors = validateFields(selectedPosition.id_cargo);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSavingAction(true);
    const data = await updatePosition(selectedPosition.id_cargo, {nombre: formData.nombre.trim(), tipo_viatico: formData.tipo_viatico});
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowEdit(false);
    setSuccessMessage('Cargo actualizado correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleToggleActive = async () => {
    setSavingAction(true);
    let data;
    if (selectedPosition.activo) {
      data = await suspendPosition(selectedPosition.id_cargo);
    }
    else {
      data = await activatePosition(selectedPosition.id_cargo);
    }
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowSuspend(false);
    if (selectedPosition.activo) {
      setSuccessMessage('Cargo bloqueado');
    }
    else {
      setSuccessMessage('Cargo activado');
    }
    setShowSuccess(true);
    await load();
  };

  return {
    reload: load,
    positions: filteredPositions,
    allPositions,
    loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch,
    selectedPosition,
    showCreate, setShowCreate,
    showEdit, setShowEdit,
    showSuspend, setShowSuspend,
    showSuccess, setShowSuccess,
    successMessage,
    formData, setFormData,
    suggestions,
    openCreate, openEdit, openSuspend,
    handleCreate, handleEdit, handleToggleActive,
  };
}

export default usePositionManagement;