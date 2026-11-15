import {useState} from 'react';
import {getPositions, createPosition, updatePosition, suspendPosition, activatePosition} from '../../services/admin/adminService';
import useServerPagination from '../shared/useServerPagination';
import useNameSuggestions from '../shared/useNameSuggestions';

const maxName = 100;

function usePositionManagement(onChanged) {
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

  const list = useServerPagination(getPositions, {search});
  const suggestions = useNameSuggestions(getPositions, formData.nombre, showCreate || showEdit, 'id_cargo', selectedPosition?.id_cargo);

  const load = async () => {
    await list.reload();
    onChanged?.();
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const showSaveError = (message) => {
    if (message.startsWith('Ya existe')) {
      setFieldErrors((prev) => ({...prev, nombre: message}));
      return;
    }
    showError(message);
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del cargo es requerido';
    }
    else if (formData.nombre.trim().length > maxName) {
      errors.nombre = `Máximo ${maxName} caracteres`;
    }
    if (!formData.tipo_viatico) {
      errors.tipo_viatico = 'Elige el tipo de la escala de viáticos';
    }
    return errors;
  };

  const openCreate = () => {
    setSelectedPosition(null);
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
      showSaveError(data.error);
      return;
    }
    setShowCreate(false);
    setSuccessMessage('Cargo creado correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleEdit = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSavingAction(true);
    const data = await updatePosition(selectedPosition.id_cargo, {nombre: formData.nombre.trim(), tipo_viatico: formData.tipo_viatico});
    setSavingAction(false);
    if (data.error) {
      showSaveError(data.error);
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
    positions: list.items, totalPositions: list.total, hasMorePositions: list.hasMore,
    loadMorePositions: list.loadMore, loadingMorePositions: list.loadingMore, listFilters: list.params,
    loading: list.loading, savingAction, error, fieldErrors, setFieldErrors,
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