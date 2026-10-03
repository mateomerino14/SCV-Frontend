import PasswordExpiredModal from './PasswordExpiredModal';
import usePasswordExpiredCheck from '../../../hooks/user/usePasswordExpiredCheck';

// Ventana global que obliga a cambiar la contrasena temporal o vencida
function PasswordChangeGate() {
  const {showModal, reason, loading, error, handleChange, handleLogout} = usePasswordExpiredCheck();
  return <PasswordExpiredModal isOpen={showModal} reason={reason} onConfirm={handleChange} onLogout={handleLogout} loading={loading} error={error} />;
}

export default PasswordChangeGate;
