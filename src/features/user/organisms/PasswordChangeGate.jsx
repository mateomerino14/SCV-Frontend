import PasswordExpiredModal from './PasswordExpiredModal';
import usePasswordExpiredCheck from '../../../hooks/user/usePasswordExpiredCheck';

function PasswordChangeGate() {
  const {showModal, reason, loading, error, handleChange, handleLogout} = usePasswordExpiredCheck();
  return <PasswordExpiredModal isOpen={showModal} reason={reason} onConfirm={handleChange} onLogout={handleLogout} loading={loading} error={error} />;
}

export default PasswordChangeGate;
