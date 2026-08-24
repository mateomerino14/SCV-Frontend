import {COLORS} from '../../../constants';
import PasswordField from '../../../components/ui/PasswordField';
import useChangePasswordModal from '../hooks/useChangePasswordModal';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm mx-4 gap-4 shadow-xl',
  title: 'text-2xl font-bold font-inter',
  subtitle: 'text-sm font-inter -mt-2',
  hint: 'text-xs font-inter mt-0.5',
  saveBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer',
  cancelBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  successMsg: 'text-sm font-inter text-center py-2 px-3 rounded-xl',
};

function ChangePasswordModal({isOpen, onClose}) {
  const {
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    loading, error, success, maxLength, handleSave, handleCancel,
  } = useChangePasswordModal(onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
      <div className={styles.card} style={{backgroundColor: COLORS.background}}>
        <p className={styles.title} style={{color: COLORS.text}}>Cambiar Contraseña</p>
        <p className={styles.subtitle} style={{color: COLORS.labels}}>Asegúrate de que tu nueva contraseña sea única y robusta.</p>
        <PasswordField label="Contraseña Actual" value={currentPassword} maxLength={maxLength}
          onChange={(event) => setCurrentPassword(event.target.value)} />
        <PasswordField label="Nueva Contraseña" value={newPassword} maxLength={maxLength}
          onChange={(event) => setNewPassword(event.target.value)} />
        <div>
          <PasswordField label="Confirmar Nueva Contraseña" value={confirmPassword} maxLength={maxLength}
            onChange={(event) => setConfirmPassword(event.target.value)} />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className={styles.hint} style={{color: COLORS.secondary}}>Las contraseñas no coinciden</p>
          )}
          {confirmPassword && newPassword === confirmPassword && (
            <p className={styles.hint} style={{color: '#2d7a3a'}}>Las contraseñas coinciden</p>
          )}
        </div>
        {success && <p className={styles.successMsg} style={{color: '#155724', backgroundColor: '#d4edda'}}>Contraseña actualizada correctamente</p>}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        <button className={styles.saveBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary}} onClick={handleSave} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
        <button className={styles.cancelBtn} style={{borderColor: COLORS.secondary, color: COLORS.secondary}} onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordModal;