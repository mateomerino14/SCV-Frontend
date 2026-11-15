import {useState, useEffect} from 'react';
import {getTravelScale, updateTravelScale} from '../../services/admin/adminService';

const maxAmount = 99999.99;
const amountFields = ['monto_interior', 'monto_clase_1_usd', 'monto_clase_2_usd'];
const emptyForm = {monto_interior: '', monto_clase_1_usd: '', monto_clase_2_usd: '', hospedaje: ''};

function useTravelScale() {
  const [scale, setScale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

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

  const openEdit = (row) => {
    setEditingType(row.tipo);
    setForm({
      monto_interior: String(parseFloat(row.monto_interior)),
      monto_clase_1_usd: String(parseFloat(row.monto_clase_1_usd)),
      monto_clase_2_usd: String(parseFloat(row.monto_clase_2_usd)),
      hospedaje: row.hospedaje,
    });
    setFieldErrors({});
    setSaveError('');
  };

  const closeEdit = () => {
    setEditingType(null);
  };

  const handleAmountChange = (field) => (event) => {
    const value = event.target.value;
    if (value !== '' && (!/^\d*\.?\d{0,2}$/.test(value) || parseFloat(value) > maxAmount)) {
      return;
    }
    setForm((prev) => ({...prev, [field]: value}));
    setFieldErrors((prev) => ({...prev, [field]: undefined}));
  };

  const handleLodgingChange = (event) => {
    const value = event.target.value;
    if (value.length > 40) {
      return;
    }
    setForm((prev) => ({...prev, hospedaje: value}));
    setFieldErrors((prev) => ({...prev, hospedaje: undefined}));
  };

  const validate = () => {
    const errors = {};
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
    setSaving(true);
    const data = await updateTravelScale(editingType, {
      monto_interior: parseFloat(form.monto_interior),
      monto_clase_1_usd: parseFloat(form.monto_clase_1_usd),
      monto_clase_2_usd: parseFloat(form.monto_clase_2_usd),
      hospedaje: form.hospedaje.trim(),
    });
    setSaving(false);
    if (data.error) {
      setSaveError(data.error);
      return;
    }
    setSavedMessage(`Escala del tipo ${editingType} actualizada. Los viajes nuevos usan las tarifas nuevas; los ya guardados conservan las suyas.`);
    setEditingType(null);
    applyScale(await getTravelScale());
  };

  return {
    scale, loading, loadError,
    editingType, form, fieldErrors, saving, saveError, savedMessage, setSavedMessage,
    openEdit, closeEdit, handleAmountChange, handleLodgingChange, handleSave,
  };
}

export default useTravelScale;
