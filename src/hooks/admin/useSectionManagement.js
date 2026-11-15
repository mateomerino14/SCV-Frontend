import {useState} from 'react';
import {getSections, createSection, updateSection, suspendSection, activateSection} from '../../services/admin/adminService';
import useServerPagination from '../shared/useServerPagination';
import useNameSuggestions from '../shared/useNameSuggestions';

const maxName = 100;

const emptyForm = {nombre: '', codigo_seccion: ''};

const sectionPayload = (formData) => ({
  nombre: formData.nombre.trim(),
  codigo_seccion: formData.codigo_seccion || null,
});

function useSectionManagement() {
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
  const [formData, setFormData] = useState(emptyForm);

  const list = useServerPagination(getSections, {search});
  const suggestions = useNameSuggestions(getSections, formData.nombre, showCreate || showEdit, 'id_seccion', selectedSection?.id_seccion);

  const load = () => list.reload();

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
      errors.nombre = 'El nombre de la sección es requerido';
    }
    else if (formData.nombre.trim().length > maxName) {
      errors.nombre = 'Máximo 100 caracteres';
    }
    return errors;
  };

  const openCreate = () => {
    setSelectedSection(null);
    setFormData(emptyForm);
    setError('');
    setFieldErrors({});
    setShowCreate(true);
  };

  const openEdit = (section) => {
    setSelectedSection(section);
    setFormData({nombre: section.nombre, codigo_seccion: section.codigo_seccion || ''});
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
    const data = await createSection({...sectionPayload(formData), activo: true});
    setSavingAction(false);
    if (data.error) {
      showSaveError(data.error);
      return;
    }
    setShowCreate(false);
    setSuccessMessage('Sección creada correctamente');
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
    const data = await updateSection(selectedSection.id_seccion, sectionPayload(formData));
    setSavingAction(false);
    if (data.error) {
      showSaveError(data.error);
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
    reload: load,
    suggestions,
    sections: list.items, totalSections: list.total, hasMoreSections: list.hasMore,
    loadMoreSections: list.loadMore, loadingMoreSections: list.loadingMore, listFilters: list.params,
    loading: list.loading, savingAction, error, fieldErrors, setFieldErrors,
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
