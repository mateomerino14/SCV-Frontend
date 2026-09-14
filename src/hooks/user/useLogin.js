import {useState} from 'react';
import {login, checkEmail, sendCode, verifyCode} from '../../services/user/authService';
import {setToken} from '../../services/shared/tokenStore';
import {jwtDecode} from 'jwt-decode';

function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState('');
  const [codeExpiresAt, setCodeExpiresAt] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordExpired, setShowPasswordExpired] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showNonExistentModal, setShowNonExistentModal] = useState(false);
  const [showInvalidEmailModal, setShowInvalidEmailModal] = useState(false);
  const [invalidEmailReason, setInvalidEmailReason] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [logging, setLogging] = useState(false);

  const closeAllModals = () => {
    setShowEmailModal(false);
    setShowConfirmModal(false);
    setShowErrorModal(false);
    setShowExpiredModal(false);
    setShowNonExistentModal(false);
    setShowInvalidEmailModal(false);
    setCodeError('');
  };

  const redirectByRole = (token) => {
    const decoded = jwtDecode(token);
    const role = decoded.id_rol;
    if (role === 1) {
      window.location.href = '/dashboard/administrador';
    }
    else if (role === 2) {
      window.location.href = '/dashboard/supervisor/viajes-pendientes';
    }
    else if (role === 4) {
      window.location.href = '/dashboard/revisor';
    }
    else {
      window.location.href = '/dashboard/empleado';
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setFieldErrors((prev) => ({...prev, email: undefined}));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setFieldErrors((prev) => ({...prev, password: undefined}));
  };

  const handleLogin = async () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'El correo electrónico es requerido';
    }
    else if (!emailRegex.test(email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    if (!password) {
      errors.password = 'La contraseña es requerida';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLogging(true);
    const data = await login(email, password);
    setLogging(false);
    if (data.token) {
      setToken(data.token);
      redirectByRole(data.token);
    }
    else {
      if (data.error?.includes('suspendida')) {
        setFieldErrors({password: 'Tu cuenta está suspendida, contacta al administrador.'});
      }
      else if (data.error?.includes('Demasiados intentos')) {
        setFieldErrors({password: data.error});
      }
      else {
        setFieldErrors({password: 'El correo o la contraseña son incorrectos'});
      }
    }
  };

  const handleForgotPassword = () => setShowEmailModal(true);

  const handleSendEmail = async (emailValue) => {
    try {
      const data = await checkEmail(emailValue);
      if (!data.exists) {
        setShowEmailModal(false);
        setShowNonExistentModal(true);
        return;
      }
      const result = await sendCode(emailValue);
      if (result.error) {
        setShowEmailModal(false);
        setInvalidEmailReason(result.error);
        setShowInvalidEmailModal(true);
        return;
      }
      if (!result.expiracion) {
        return;
      }
      setForgotEmail(emailValue);
      setCodeExpiresAt(result.expiracion);
      setShowEmailModal(false);
      setShowConfirmModal(true);
    }
    catch {}
  };

  const handleVerifyCode = async (codeValue) => {
    if (!codeValue || codeValue.trim().length < 7) {
      setCodeError('Ingresa el código completo de 7 dígitos');
      return;
    }
    setCodeError('');
    setVerifying(true);
    const data = await verifyCode(forgotEmail, codeValue);
    setVerifying(false);
    if (data.message === 'Código verificado correctamente') {
      closeAllModals();
      setToken(data.token);
      redirectByRole(data.token);
    }
    else if (data.error === 'Código expirado') {
      setShowConfirmModal(false);
      setShowExpiredModal(true);
    }
    else {
      setShowConfirmModal(false);
      setShowErrorModal(true);
    }
  };

  const handleResendCode = async () => {
    try {
      const result = await sendCode(forgotEmail);
      if (result.error || !result.expiracion) {
        return;
      }
      setCodeExpiresAt(result.expiracion);
      setCodeError('');
      setShowErrorModal(false);
      setShowExpiredModal(false);
      setShowConfirmModal(true);
    }
    catch {}
  };

  const handleExpired = () => {
    setShowConfirmModal(false);
    setShowExpiredModal(true);
  };

  return {
    email,
    password,
    showPassword, setShowPassword,
    fieldErrors,
    codeExpiresAt,
    codeError,
    verifying,
    logging,
    showEmailModal,
    showConfirmModal,
    showErrorModal,
    showExpiredModal,
    showNonExistentModal,
    showInvalidEmailModal,
    invalidEmailReason,
    closeAllModals,
    showPasswordExpired, setShowPasswordExpired,
    redirectByRole,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
    handleForgotPassword,
    handleSendEmail,
    handleVerifyCode,
    handleResendCode,
    handleExpired,
  };
}

export default useLogin;