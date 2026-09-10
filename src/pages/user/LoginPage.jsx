import {Eye, EyeOff, Mail, Lock} from 'lucide-react';
import Button from '../../components/ui/Button';
import AppHeader from '../../components/ui/AppHeader';
import AppLogo from '../../components/ui/AppLogo';
import EmailModal from '../../features/user/organisms/EmailModal';
import VerificationCodeModal from '../../features/user/organisms/VerificationCodeModal';
import ErrorModal from '../../features/user/organisms/ErrorModal';
import ExpiredCodeModal from '../../features/user/organisms/ExpiredCodeModal';
import NonExistentAccountModal from '../../features/user/organisms/NonExistentAccountModal';
import useLogin from '../../hooks/user/useLogin';
import {LOGIN_IMAGE} from '../../constants';

const styles = {
  page: 'min-h-screen bg-gray-100 flex items-center justify-center',
  mobileContainer: 'md:hidden bg-white w-full max-w-sm mx-4 rounded-2xl shadow-lg overflow-hidden animate-fade-in',
  mobileHeader: 'px-6 pt-6',
  mobileTitle: 'text-2xl font-bold font-inter',
  mobileSubtitle: 'text-gray-500 text-sm font-inter',
  mobileImageWrapper: 'px-6 my-4',
  mobileImage: 'w-full h-40 object-cover rounded-xl',
  mobileForm: 'px-6 pb-6',
  desktopContainer: 'hidden md:flex bg-white w-[80vw] rounded-2xl shadow-lg overflow-hidden h-[85vh] animate-fade-in',
  desktopImage: 'w-full h-full object-cover',
  desktopForm: 'w-1/2 flex flex-col justify-center px-16 py-12',
  formSection: 'flex flex-col gap-5 w-full',
  label: 'text-sm font-bold font-inter text-gray-600 uppercase',
  inputWrapper: 'flex items-center border rounded-lg px-4 py-3 gap-2 mt-1',
  input: 'w-full outline-none font-inter text-base',
  fieldError: 'text-red-600 text-xs font-inter italic mt-1 text-left',
  forgotPassword: 'text-red-600 text-sm font-inter cursor-pointer hover:underline',
};

function LoginPage() {
  const {
    email, password, showPassword, setShowPassword, fieldErrors, codeExpiresAt, showInvalidEmailModal, invalidEmailReason,
    showEmailModal, showConfirmModal, showErrorModal, showExpiredModal, showNonExistentModal, closeAllModals,
    handleLogin, codeError, verifying, logging, handleForgotPassword, handleEmailChange, handlePasswordChange,
    handleSendEmail, handleVerifyCode, handleResendCode, handleExpired,
  } = useLogin();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  const formSection = (
    <form className={styles.formSection} onSubmit={handleSubmit}>
      <div className="hidden md:block">
        <AppHeader />
      </div>
      <div>
        <label className={styles.label}>Correo Corporativo</label>
        <div className={styles.inputWrapper} style={{borderColor: fieldErrors.email ? '#dc2626' : '#e5e7eb'}}>
          <Mail size={18} className="text-gray-400" />
          <input type="email" placeholder="nombre@empresa.com" className={styles.input} disabled={logging}
            value={email} onChange={(event) => handleEmailChange(event.target.value)} />
        </div>
        {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center">
          <label className={styles.label}>Contraseña</label>
          <button type="button" onClick={handleForgotPassword} className={styles.forgotPassword}>¿Olvidaste tu contraseña?</button>
        </div>
        <div className={styles.inputWrapper} style={{borderColor: fieldErrors.password ? '#dc2626' : '#e5e7eb'}}>
          <Lock size={18} className="text-gray-400" />
          <input type={showPassword ? 'text' : 'password'} placeholder="••••••••••••••••" className={styles.input} disabled={logging}
            value={password} onChange={(event) => handlePasswordChange(event.target.value)} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={logging}>
            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        </div>
        {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
      </div>
      <Button text={logging ? 'Iniciando...' : 'Iniciar Sesión'} variant="primary" type="submit" disabled={logging} />
      <AppLogo />
    </form>
  );

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
        <div className={styles.mobileForm}>{formSection}</div>
      </div>
      <div className={styles.desktopContainer}>
        <div className="w-1/2">
          <img src={LOGIN_IMAGE} alt="login" className={styles.desktopImage} />
        </div>
        <div className={styles.desktopForm}>{formSection}</div>
      </div>
      <EmailModal isOpen={showEmailModal} onClose={closeAllModals} onSend={handleSendEmail} />
      <VerificationCodeModal isOpen={showConfirmModal} onClose={closeAllModals} onVerify={handleVerifyCode} onResend={handleResendCode}
        onExpired={handleExpired} expiresAt={codeExpiresAt} codeError={codeError} verifying={verifying} />
      <ErrorModal isOpen={showErrorModal} onClose={closeAllModals} onResend={handleResendCode} />
      <ExpiredCodeModal isOpen={showExpiredModal} onClose={closeAllModals} onResend={handleResendCode} />
      <NonExistentAccountModal isOpen={showNonExistentModal} onClose={closeAllModals} />
      <NonExistentAccountModal isOpen={showInvalidEmailModal} onClose={closeAllModals} message={invalidEmailReason} />
    </div>
  );
}

export default LoginPage;