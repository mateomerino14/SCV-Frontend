import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Button from '../components/ui/Button'
import AppHeader from '../components/ui/AppHeader'
import AppLogo from '../components/ui/AppLogo'
import EmailModal from '../features/Login/EmailModal'
import ConfirmacionModal from '../features/Login/ConfirmacionModal'
import ErrorModal from '../features/Login/ErrorModal'
import ExpiredCodeModal from '../features/Login/ExpiredCodeModal'
import NonExistentAccountModal from '../features/Login/NonExistentAccountModal'
import useLogin from '../hooks/useLogin'
import { LOGIN_IMAGE } from '../constants'

const styles = {
  page: "min-h-screen bg-gray-100 flex items-center justify-center",
  mobileContainer: "md:hidden bg-white w-full max-w-sm mx-4 rounded-2xl shadow-lg overflow-hidden",
  mobileHeader: "px-6 pt-6",
  mobileTitle: "text-2xl font-bold font-inter",
  mobileSubtitle: "text-gray-500 text-sm font-inter",
  mobileImageWrapper: "px-6 my-4",
  mobileImage: "w-full h-40 object-cover rounded-xl",
  mobileForm: "px-6 pb-6",
  desktopContainer: "hidden md:flex bg-white w-[80vw] rounded-2xl shadow-lg overflow-hidden h-[85vh]",
  desktopImage: "w-full h-full object-cover",
  desktopForm: "w-1/2 flex flex-col justify-center px-16 py-12",
  formSection: "flex flex-col gap-5 w-full",
  label: "text-sm font-bold font-inter text-gray-600 uppercase",
  inputWrapper: "flex items-center border rounded-lg px-4 py-3 gap-2 mt-1",
  input: "w-full outline-none font-inter text-base",
  errorMsg: "text-red-600 text-sm mt-1 font-inter italic text-center",
  forgotPassword: "text-red-600 text-sm font-inter cursor-pointer hover:underline",
}

function LoginPage() {
  const {
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
    handleLogin,
    handleForgotPassword,
    handleSendEmail,
    handleVerifyCode,
    handleResendCode,
    handleExpired,
  } = useLogin()

  const formSection = (
    <div className={styles.formSection}>
      <div className="hidden md:block">
        <AppHeader />
      </div>

      <div>
        <label className={styles.label}>Correo Corporativo</label>
        <div className={styles.inputWrapper}>
          <Mail size={18} className="text-gray-400" />
          <input
            type="email"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className={styles.label}>Contraseña</label>
          <button onClick={handleForgotPassword} className={styles.forgotPassword}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className={styles.inputWrapper}>
          <Lock size={18} className="text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
      </div>

      <Button text="Iniciar Sesión" variant="primary" onClick={handleLogin} />
      <AppLogo />
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.mobileContainer}>
        <div className={styles.mobileHeader}>
          <AppHeader />
          <h1 className={styles.mobileTitle}>Iniciar Sesión</h1>
          <p className={styles.mobileSubtitle}>Accede a tu panel administrativo corporativo</p>
        </div>
        <div className={styles.mobileImageWrapper}>
          <img src={LOGIN_IMAGE} alt="login" className={styles.mobileImage} />
        </div>
        <div className={styles.mobileForm}>
          {formSection}
        </div>
      </div>

      <div className={styles.desktopContainer}>
        <div className="w-1/2">
          <img src={LOGIN_IMAGE} alt="login" className={styles.desktopImage} />
        </div>
        <div className={styles.desktopForm}>
          {formSection}
        </div>
      </div>

      <EmailModal isOpen={showEmailModal} onClose={closeAllModals} onSend={handleSendEmail} />
      <ConfirmacionModal isOpen={showConfirmModal} onClose={closeAllModals} onVerify={handleVerifyCode} onResend={handleResendCode} onExpired={handleExpired} expiresAt={codeExpiresAt} />
      <ErrorModal isOpen={showErrorModal} onClose={closeAllModals} onResend={handleResendCode} />
      <ExpiredCodeModal isOpen={showExpiredModal} onClose={closeAllModals} onResend={handleResendCode} />
      <NonExistentAccountModal isOpen={showNonExistentModal} onClose={closeAllModals} />
    </div>
  )
}

export default LoginPage;