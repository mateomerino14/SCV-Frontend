import {useState, useEffect} from 'react';
import {getUsers, createUser, updateUser, suspendUser, activateUser, getPositions, getSections} from '../../services/admin/adminService';

function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const [sectionFilter, setSectionFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '',
    email_corporativo: '', telefono: '',
    id_cargo: '', id_rol: 3,
    id_jefe_directo: '', id_seccion: '', carnet_identidad: '',
  });

  const load = async () => {
    setLoading(true);
    const [usersData, positionsData, sectionsData] = await Promise.all([getUsers(), getPositions(), getSections()]);
    setLoading(false);
    if (!usersData.error) {
      setUsers(usersData);
    }
    if (!positionsData.error) {
      setPositions(positionsData);
    }
    if (!sectionsData.error) {
      setSections(sectionsData);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const emailAlreadyExists = (email, excludeId = null) => {
    return users.some((user) => {
      const sameEmail = user.email_corporativo.toLowerCase() === email.toLowerCase();
      if (excludeId) {
        return sameEmail && user.id_usuario !== excludeId;
      }
      return sameEmail;
    });
  };

  const onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const onlyNumbers = /^[0-9]+$/;

  const validateFields = (excludeId = null) => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    else if (!onlyLetters.test(formData.nombre.trim())) {
      errors.nombre = 'Solo puede contener letras';
    }
    else if (formData.nombre.trim().length > 30) {
      errors.nombre = 'Máximo 30 caracteres';
    }
    if (!formData.apellido_paterno.trim()) {
      errors.apellido_paterno = 'El apellido paterno es requerido';
    }
    else if (!onlyLetters.test(formData.apellido_paterno.trim())) {
      errors.apellido_paterno = 'Solo puede contener letras';
    }
    else if (formData.apellido_paterno.trim().length > 30) {
      errors.apellido_paterno = 'Máximo 30 caracteres';
    }
    if (formData.apellido_materno.trim()) {
      if (!onlyLetters.test(formData.apellido_materno.trim())) {
        errors.apellido_materno = 'Solo puede contener letras';
      }
      else if (formData.apellido_materno.trim().length > 30) {
        errors.apellido_materno = 'Máximo 30 caracteres';
      }
    }
    if (!formData.email_corporativo.trim()) {
      errors.email_corporativo = 'El correo es requerido';
    }
    else if (!emailRegex.test(formData.email_corporativo)) {
      errors.email_corporativo = 'Ingresa un correo válido';
    }
    else if (formData.email_corporativo.length > 100) {
      errors.email_corporativo = 'Máximo 100 caracteres';
    }
    else if (emailAlreadyExists(formData.email_corporativo, excludeId)) {
      errors.email_corporativo = 'Ya existe un usuario con ese correo';
    }
    if (formData.telefono.trim()) {
      if (!onlyNumbers.test(formData.telefono.trim())) {
        errors.telefono = 'Solo puede contener números';
      }
      else if (formData.telefono.trim().length < 7) {
        errors.telefono = 'Mínimo 7 dígitos';
      }
      else if (formData.telefono.trim().length > 8) {
        errors.telefono = 'Máximo 8 dígitos';
      }
    }
    if (!formData.id_cargo) {
      errors.id_cargo = 'Selecciona un cargo';
    }
    return errors;
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nombre} ${user.apellido_paterno}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesRole = roleFilter === 'TODOS' || user.Rol?.nombre === roleFilter;
    const matchesSection = !sectionFilter || String(user.id_seccion) === String(sectionFilter);
    return matchesSearch && matchesRole && matchesSection;
  });

  const openCreate = () => {
    const firstActivePosition = positions.filter((position) => position.activo)[0];
    setFormData({
      nombre: '', apellido_paterno: '', apellido_materno: '',
      email_corporativo: '', telefono: '',
      id_cargo: firstActivePosition?.id_cargo || '', id_rol: 3,
      id_jefe_directo: '', id_seccion: '', carnet_identidad: '',
    });
    setError('');
    setFieldErrors({});
    setShowCreate(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno || '',
      email_corporativo: user.email_corporativo,
      telefono: user.telefono || '',
      id_cargo: user.Cargo?.id_cargo || '',
      id_rol: user.id_rol,
      id_jefe_directo: user.id_jefe_directo || '',
      id_seccion: user.id_seccion || '',
      carnet_identidad: user.carnet_identidad || '',
    });
    setError('');
    setFieldErrors({});
    setShowEdit(true);
  };

  const openSuspend = (user) => {
    setSelectedUser(user);
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
    const data = await createUser({...formData, activo: true, id_jefe_directo: formData.id_jefe_directo || null, id_seccion: formData.id_seccion || null});
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowCreate(false);
    setSuccessMessage('Usuario creado correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleEdit = async () => {
    const errors = validateFields(selectedUser.id_usuario);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    const payload = {
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      email_corporativo: formData.email_corporativo,
      telefono: formData.telefono?.trim() || null,
      id_cargo: formData.id_cargo,
      id_rol: formData.id_rol,
      id_jefe_directo: formData.id_jefe_directo || null,
      id_seccion: formData.id_seccion || null,
      carnet_identidad: formData.carnet_identidad?.trim() || null,
    };
    setSavingAction(true);
    const data = await updateUser(selectedUser.id_usuario, payload);
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowEdit(false);
    setSuccessMessage('Usuario actualizado correctamente');
    setShowSuccess(true);
    await load();
  };

  const handleToggleActive = async () => {
    setSavingAction(true);
    let data;
    if (selectedUser.activo) {
      data = await suspendUser(selectedUser.id_usuario);
    }
    else {
      data = await activateUser(selectedUser.id_usuario);
    }
    setSavingAction(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setShowSuspend(false);
    if (selectedUser.activo) {
      setSuccessMessage('Usuario suspendido');
    }
    else {
      setSuccessMessage('Usuario activado');
    }
    setShowSuccess(true);
    await load();
  };

  return {
    users: filteredUsers,
    allUsers: users,
    positions, sections, loading, savingAction, error, fieldErrors, setFieldErrors,
    search, setSearch, roleFilter, setRoleFilter, sectionFilter, setSectionFilter,
    selectedUser,
    showCreate, setShowCreate, showEdit, setShowEdit,
    showSuspend, setShowSuspend, showSuccess, setShowSuccess,
    successMessage, formData, setFormData,
    openCreate, openEdit, openSuspend,
    handleCreate, handleEdit, handleToggleActive,
  };
}

export default useUserManagement;