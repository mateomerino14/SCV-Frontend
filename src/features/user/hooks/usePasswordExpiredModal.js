import {useState, useEffect} from 'react';

const minLength = 6;

function usePasswordExpiredModal(externalError) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (externalError) {
      showError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    setFieldErrors((prev) => {
      const next = {...prev};
      if (newPassword && newPassword.length < minLength) {
        next.newPassword = `La nueva contraseña debe tener al menos ${minLength} caracteres`;
      }
      else if (newPassword && currentPassword && newPassword === currentPassword) {
        next.newPassword = 'La nueva contraseña no puede ser igual a la actual';
      }
      else {
        delete next.newPassword;
      }
      if (confirmPassword && newPassword && confirmPassword !== newPassword) {
        next.confirmPassword = 'Las contraseñas no coinciden';
      }
      else {
        delete next.confirmPassword;
      }
      return next;
    });
  }, [currentPassword, newPassword, confirmPassword]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleConfirm = (onConfirm) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Completa todos los campos requeridos');
      return;
    }
    if (fieldErrors.newPassword || fieldErrors.confirmPassword) {
      return;
    }
    onConfirm(currentPassword, newPassword);
  };

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    error, fieldErrors,
    handleConfirm,
  };
}

export default usePasswordExpiredModal;