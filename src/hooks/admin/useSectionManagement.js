import {useState, useEffect} from 'react';
import {getSections, createSection, updateSection, suspendSection, activateSection} from '../../services/admin/adminService';

const maxName = 100;

function normalizeSectionName(name) {
  return (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
}

function useSectionManagement() {
  const [allSections, setAllSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({nombre: ''});

  const load = async () => {
    setLoading(true);
    const data = await getSections();
    setLoading(false);
    if (!data.error) {
      setAllSections(data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const filteredSections = allSections.filter((section) =>
    section.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const sectionAlreadyExists = (name, excludeId = null) => {
    const normalizedName = normalizeSectionName(name);
    return allSections.some((section) => {
      const sameName = normalizeSectionName(section.nombre) === normalizedName;
      if (excludeId) {
        return sameName && section.id_seccion !== excludeId;
      }
      return sameName;
    });
  };

  const validateFields = (excludeId = null) => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre de la sección es requerido';
    }
    else if (formData.nombre.trim().length > maxName) {
      errors.nombre = 'Máximo 100 caracteres';
    }
    else if (sectionAlreadyExists(formData.nombre.trim(), excludeId)) {
      errors.nombre = 'Ya existe una sección con ese nombre';
    }
    return errors;
  };

  const openCreate = () => {
    setFormData({nombre: ''});
    setError('');
    setFieldErrors({});
    setShowCreate(true);
  };

  const openEdit = (section) => {
    setSelectedSection(section);
    setFormData({nombre: section.nombre});
    setError('');
    setFieldErrors({});
    setShowEdit(true);
  };

  const openSuspend = (section) => {
    setSelectedSection(section);
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
    const data = await createSection({nombre: formData.nombre.trim(), activo: true});
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowCreate(false);
    setSuccessMessage('Sección creada correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleEdit = async () => {
    const errors = validateFields(selectedSection.id_seccion);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSavingAction(true);
    const data = await updateSection(selectedSection.id_seccion, {nombre: formData.nombre.trim()});
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowEdit(false);
    setSuccessMessage('Sección actualizada correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleToggleActive = async () => {
    setSavingAction(true);
    let data;
    if (selectedSection.activo) {
      data = await suspendSection(selectedSection.id_seccion);
    }
    else {
      data = await activateSection(selectedSection.id_seccion);
    }
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowSuspend(false);
    if (selectedSection.activo) {
      setSuccessMessage('Sección bloqueada');
    }
    else {
      setSuccessMessage('Sección activada');
    }
    setShowSuccess(true);
    await load();
  };

  return {
    sections: filteredSections,
    allSections,
    loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch,
    selectedSection,
    showCreate, setShowCreate,
    showEdit, setShowEdit,
    showSuspend, setShowSuspend,
    showSuccess, setShowSuccess,
    successMessage,
    formData, setFormData,
    openCreate, openEdit, openSuspend,
    handleCreate, handleEdit, handleToggleActive,
  };
}

export default useSectionManagement;
