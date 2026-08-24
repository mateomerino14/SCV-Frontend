import {useState} from 'react';
import {changePassword} from '../../../services/user/userService';

const maxLength = 255;
const minLength = 6;

function useChangePasswordModal(onClose) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Todos los campos son requeridos');
      return;
    }

    if (newPassword.trim() !== newPassword) {
      showError('La contraseña no puede tener espacios al inicio o al final');
      return;
    }

    if (newPassword.length < minLength) {
      showError(`La nueva contraseña debe tener al menos ${minLength} caracteres`);
      return;
    }

    if (newPassword.length > maxLength) {
      showError(`La nueva contraseña no puede tener más de ${maxLength} caracteres`);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword === currentPassword) {
      showError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);
    const data = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (data.error) {
      showError(data.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      reset();
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    loading, error, success, maxLength,
    handleSave, handleCancel,
  };
}

export default useChangePasswordModal;