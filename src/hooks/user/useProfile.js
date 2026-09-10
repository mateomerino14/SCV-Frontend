import {useState, useEffect} from 'react';
import {getMe, updateProfile, updateProfilePhoto} from '../../services/user/userService';

function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getMe();
      setLoading(false);
      if (data.error) {
        setError(data.error);
        return;
      }
      setUser(data);
      setPhone(data.telefono || '');
      setEmail(data.email_corporativo || '');
    };
    load();
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);
  };

  const closeSuccess = () => {
    setSuccess('');
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleSavePhone = async () => {
    const cleanPhone = phone.trim();
    if (cleanPhone && !/^[0-9]{7,8}$/.test(cleanPhone)) {
      showError('El teléfono debe tener 7 u 8 dígitos numéricos');
      return;
    }
    setSaving(true);
    const data = await updateProfile({telefono: cleanPhone || null});
    setSaving(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setUser((prev) => ({...prev, telefono: data.telefono}));
    setPhone(data.telefono || '');
    setEditingPhone(false);
    showSuccess('Teléfono actualizado correctamente');
  };

  const handleSaveEmail = async () => {
    if (!email.trim()) {
      showError('El correo no puede estar vacío');
      return;
    }
    if (email.length > 100) {
      showError('El correo no puede tener más de 100 caracteres');
      return;
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      showError('El correo no tiene un formato válido');
      return;
    }
    setSaving(true);
    const data = await updateProfile({email_corporativo: email.trim()});
    setSaving(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setUser((prev) => ({...prev, email_corporativo: data.email_corporativo}));
    setEmail(data.email_corporativo || '');
    setEditingEmail(false);
    showSuccess('Correo actualizado correctamente');
  };

  const handleCancelPhone = () => {
    setPhone(user?.telefono || '');
    setEditingPhone(false);
  };

  const handleCancelEmail = () => {
    setEmail(user?.email_corporativo || '');
    setEditingEmail(false);
  };

  const handleChangePhoto = async (file) => {
    if (!file) {
      return;
    }
    setSaving(true);
    const data = await updateProfilePhoto(file);
    setSaving(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setUser((prev) => ({...prev, foto_perfil: data.foto_perfil}));
    showSuccess('Foto de perfil actualizada correctamente');
  };

  const handleRemovePhoto = async () => {
    setSaving(true);
    const data = await updateProfile({foto_perfil: null});
    setSaving(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    setUser((prev) => ({...prev, foto_perfil: null}));
    showSuccess('Foto de perfil eliminada');
  };

  return {
    user,
    loading,
    error,
    success, closeSuccess,
    saving,
    phone, setPhone,
    email, setEmail,
    editingPhone, setEditingPhone,
    editingEmail, setEditingEmail,
    handleSavePhone,
    handleSaveEmail,
    handleRemovePhoto,
    handleCancelPhone,
    handleCancelEmail,
    handleChangePhoto,
  };
}

export default useProfile;