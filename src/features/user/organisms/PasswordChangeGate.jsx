import PasswordExpiredModal from './PasswordExpiredModal';
import usePasswordExpiredCheck from '../../../hooks/user/usePasswordExpiredCheck';

// Ventana global que obliga a cambiar la contrasena (temporal o vencida) en cualquier
// pantalla, apenas el usuario entra o el servidor lo exige
function PasswordChangeGate() {
  const {showModal, reason, loading, error, handleChange} = usePasswordExpiredCheck();
  return <PasswordExpiredModal isOpen={showModal} reason={reason} onConfirm={handleChange} loading={loading} error={error} />;
}

export default PasswordChangeGate;
