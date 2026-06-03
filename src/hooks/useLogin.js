import { useState } from 'react'
import { login, checkEmail, sendCode, verifyCode } from '../services/authService'
import { jwtDecode } from 'jwt-decode'

function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [codeExpiresAt, setCodeExpiresAt] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showContraseniavencida, setShowContraseniavencida] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [showNonExistentModal, setShowNonExistentModal] = useState(false)

  const showError = (msg) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(''), 3000)
  }

  const closeAllModals = () => {
    setShowEmailModal(false)
    setShowConfirmModal(false)
    setShowErrorModal(false)
    setShowExpiredModal(false)
    setShowNonExistentModal(false)
  }


const redirectByRole = (token) => {
  const decoded = jwtDecode(token)
  const rol = decoded.id_rol
  if (rol === 1) window.location.href = '/dashboard/administrador'
  else if (rol === 2) window.location.href = '/dashboard/supervisor'
  else if (rol === 4) window.location.href = '/dashboard/revisor'
  else window.location.href = '/dashboard/empleado'
}

const handleLogin = async () => {
  if (!email && !password) { showError('Rellene los campos requeridos'); return }
  if (!email) { showError('Ingresa tu correo electrónico'); return }
  if (!password) { showError('Ingresa tu contraseña'); return }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { showError('Ingresa un correo electrónico válido'); return }

  const data = await login(email, password)
  if (data.token) {
    localStorage.setItem('token', data.token)
    redirectByRole(data.token)
  } else {
    showError(data.error || 'La contraseña o el email son incorrectos')
  }
}

  const handleForgotPassword = () => setShowEmailModal(true)

  const handleSendEmail = async (emailValue) => {
    const data = await checkEmail(emailValue)
    if (data.exists) {
      const result = await sendCode(emailValue)
      setForgotEmail(emailValue)
      setCodeExpiresAt(result.expiracion)
      setShowEmailModal(false)
      setShowConfirmModal(true)
    } else {
      setShowEmailModal(false)
      setShowNonExistentModal(true)
    }
  }

  const handleVerifyCode = async (codeValue) => {
    const data = await verifyCode(forgotEmail, codeValue)
    if (data.message === 'Código verificado correctamente') {
      closeAllModals()
      localStorage.setItem('token', data.token)
        redirectByRole(data.token)
    } else if (data.error === 'Código expirado') {
      setShowConfirmModal(false)
      setShowExpiredModal(true)
    } else {
      setShowConfirmModal(false)
      setShowErrorModal(true)
    }
  }

  const handleResendCode = async () => {
    const result = await sendCode(forgotEmail)
    setCodeExpiresAt(result.expiracion)
    setShowErrorModal(false)
    setShowExpiredModal(false)
    setShowConfirmModal(true)
 }



  const handleExpired = () => {
    setShowConfirmModal(false)
    setShowExpiredModal(true)
  }

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    errorMsg,
    codeExpiresAt,
    showEmailModal,
    showConfirmModal,
    showErrorModal,
    showExpiredModal,
    showNonExistentModal,
    closeAllModals,
    showContraseniavencida,
    setShowContraseniavencida,
    redirectByRole,
    handleLogin,
    handleForgotPassword,
    handleSendEmail,
    handleVerifyCode,
    handleResendCode,
    handleExpired,
  }
}

export default useLogin;