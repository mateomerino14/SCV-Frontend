import {useState, useEffect} from 'react';

const minLength = 8;
const errorDuration = 3000;

function usePasswordExpiredModal(externalError, requiresCurrentPassword = true) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [hiddenExternalError, setHiddenExternalError] = useState('');
  const [previousExternalError, setPreviousExternalError] = useState(externalError);

  if (externalError !== previousExternalError) {
    setPreviousExternalError(externalError);
    setHiddenExternalError('');
  }

  useEffect(() => {
    if (!externalError) {
      return undefined;
    }
    const timer = setTimeout(() => setHiddenExternalError(externalError), errorDuration);
    return () => clearTimeout(timer);
  }, [externalError]);

  const fieldErrors = {};
  if (newPassword && newPassword.length < minLength) {
    fieldErrors.newPassword = `La nueva contraseña debe tener al menos ${minLength} caracteres`;
  }
  else if (newPassword && currentPassword && newPassword === currentPassword) {
    fieldErrors.newPassword = 'La nueva contraseña no puede ser igual a la actual';
  }
  if (confirmPassword && newPassword && confirmPassword !== newPassword) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden';
  }

  let visibleError = error;
  if (!visibleError && externalError && externalError !== hiddenExternalError) {
    visibleError = externalError;
  }

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), errorDuration);
  };

  const handleConfirm = (onConfirm) => {
    if ((requiresCurrentPassword && !currentPassword) || !newPassword || !confirmPassword) {
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
    error: visibleError, fieldErrors,
    handleConfirm,
  };
}

export default usePasswordExpiredModal;