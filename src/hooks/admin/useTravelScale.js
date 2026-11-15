import {useState, useEffect} from 'react';
import {getTravelScale, createTravelScale, updateTravelScale, deleteTravelScale} from '../../services/admin/adminService';

const maxAmount = 99999.99;
const amountFields = ['monto_interior', 'monto_clase_1_usd', 'monto_clase_2_usd'];
const textLimits = {hospedaje: 40, descripcion: 100};
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const emptyForm = {tipo: '', descripcion: '', monto_interior: '', monto_clase_1_usd: '', monto_clase_2_usd: '', hospedaje: ''};

function useTravelScale() {
  const [scale, setScale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [deletingType, setDeletingType] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const scaleTypes = scale.map((row) => row.tipo);

  const applyScale = (data) => {
    setLoading(false);
    if (data.error) {
      setLoadError(data.error);
      return;
    }
    setLoadError('');
    setScale(data);
  };

  useEffect(() => {
    getTravelScale().then(applyScale);
  }, []);

  const openCreate = () => {
    setFormMode('create');
    setEditingType(null);
    setForm({...emptyForm, tipo: letters.find((letter) => !scaleTypes.includes(letter)) || ''});
    setFieldErrors({});
    setSaveError('');
  };

  const openEdit = (row) => {
    setFormMode('edit');
    setEditingType(row.tipo);
    setForm({
      tipo: row.tipo,
      descripcion: row.descripcion,
      monto_interior: String(parseFloat(row.monto_interior)),
      monto_clase_1_usd: String(parseFloat(row.monto_clase_1_usd)),
      monto_clase_2_usd: String(parseFloat(row.monto_clase_2_usd)),
      hospedaje: row.hospedaje,
    });
    setFieldErrors({});
    setSaveError('');
  };

  const closeForm = () => {
    setFormMode(null);
  };

  const handleTypeChange = (event) => {
    const value = event.target.value.toUpperCase();
    if (value !== '' && !/^[A-Z]$/.test(value)) {
      return;
    }
    setForm((prev) => ({...prev, tipo: value}));
    setFieldErrors((prev) => ({...prev, tipo: undefined}));
  };

  const handleAmountChange = (field) => (event) => {
    const value = event.target.value;
    if (value !== '' && (!/^\d*\.?\d{0,2}$/.test(value) || parseFloat(value) > maxAmount)) {
      return;
    }
    setForm((prev) => ({...prev, [field]: value}));
    setFieldErrors((prev) => ({...prev, [field]: undefined}));
  };

  const handleTextChange = (field) => (event) => {
    const value = event.target.value;
    if (value.length > textLimits[field]) {
      return;
    }
    setForm((prev) => ({...prev, [field]: value}));
    setFieldErrors((prev) => ({...prev, [field]: undefined}));
  };

  const validate = () => {
    const errors = {};
    if (formMode === 'create') {
      if (!form.tipo) {
        errors.tipo = 'Escribe la letra del tipo';
      }
      else if (scaleTypes.includes(form.tipo)) {
        errors.tipo = `Ya existe el tipo ${form.tipo}`;
      }
    }
    if (!form.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }
    amountFields.forEach((field) => {
      if (form[field] === '' || isNaN(parseFloat(form[field]))) {
        errors[field] = 'El monto es requerido';
      }
    });
    if (!form.hospedaje.trim()) {
      errors.hospedaje = 'El hospedaje es requerido';
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const payload = {
      descripcion: form.descripcion.trim(),
      monto_interior: parseFloat(form.monto_interior),
      monto_clase_1_usd: parseFloat(form.monto_clase_1_usd),
      monto_clase_2_usd: parseFloat(form.monto_clase_2_usd),
      hospedaje: form.hospedaje.trim(),
    };
    setSaving(true);
    let data;
    let message;
    if (formMode === 'create') {
      data = await createTravelScale({...payload, tipo: form.tipo});
      message = `Se agregó el tipo ${form.tipo} a la escala. Ya puedes asignarlo a los cargos.`;
    }
    else {
      data = await updateTravelScale(editingType, payload);
      message = `Escala del tipo ${editingType} actualizada. Los viajes nuevos usan las tarifas nuevas; los ya guardados conservan las suyas.`;
    }
    setSaving(false);
    if (data.error) {
      setSaveError(data.error);
      return;
    }
    setSavedMessage(message);
    setFormMode(null);
    applyScale(await getTravelScale());
  };

  const openDelete = (row) => {
    setDeletingType(row.tipo);
    setDeleteError('');
  };

  const closeDelete = () => {
    setDeletingType(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const data = await deleteTravelScale(deletingType);
    setDeleting(false);
    if (data.error) {
      setDeleteError(data.error);
      return;
    }
    setSavedMessage(`Se eliminó el tipo ${deletingType} de la escala.`);
    setDeletingType(null);
    applyScale(await getTravelScale());
  };

  return {
    scale, scaleTypes, loading, loadError,
    formMode, editingType, form, fieldErrors, saving, saveError, savedMessage, setSavedMessage,
    openCreate, openEdit, closeForm, handleTypeChange, handleAmountChange, handleTextChange, handleSave,
    deletingType, deleting, deleteError, openDelete, closeDelete, handleDelete,
  };
}

export default useTravelScale;
