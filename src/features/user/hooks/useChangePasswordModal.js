import {useState, useEffect} from 'react';
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
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const next = {};
    if (newPassword && newPassword.length < minLength) {
      next.newPassword = `La nueva contraseña debe tener al menos ${minLength} caracteres`;
    }
    else if (newPassword && newPassword.trim() !== newPassword) {
      next.newPassword = 'La contraseña no puede tener espacios al inicio o al final';
    }
    else if (newPassword && currentPassword && newPassword === currentPassword) {
      next.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }
    if (confirmPassword && confirmPassword !== newPassword) {
      next.confirmPassword = 'Las contraseñas no coinciden';
    }
    setFieldErrors(next);
  }, [currentPassword, newPassword, confirmPassword]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setFieldErrors({});
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Todos los campos son requeridos');
      return;
    }
    if (fieldErrors.newPassword || fieldErrors.confirmPassword) {
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
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const closeSuccess = () => {
    reset();
    onClose();
  };

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    loading, error, success, maxLength, fieldErrors,
    handleSave, handleCancel, closeSuccess,
  };
}

export default useChangePasswordModal;