import {motion, AnimatePresence} from 'framer-motion';
import {COLORS} from '../../../constants';
import PasswordField from '../../../components/ui/PasswordField';
import InlineAlert from '../../../components/ui/InlineAlert';
import SuccessModal from '../../../components/ui/SuccessModal';
import useChangePasswordModal from '../hooks/useChangePasswordModal';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm mx-4 gap-4 shadow-xl',
  title: 'text-2xl font-bold font-inter',
  subtitle: 'text-sm font-inter -mt-2',
  fieldError: 'text-xs font-inter mt-0.5',
  saveBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer',
  cancelBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function ChangePasswordModal({isOpen, onClose}) {
  const {
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    loading, error, success, maxLength, fieldErrors, handleSave, handleCancel, closeSuccess,
  } = useChangePasswordModal(onClose);

  return (
    <>
      <AnimatePresence>
        {isOpen && !success && (
          <motion.div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
            variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
            <motion.div className={styles.card} style={{backgroundColor: COLORS.background}}
              variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
              <p className={styles.title} style={{color: COLORS.text}}>Cambiar Contraseña</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>Asegúrate de que tu nueva contraseña sea única y robusta.</p>
              <PasswordField label="Contraseña Actual" value={currentPassword} maxLength={maxLength}
                onChange={(event) => setCurrentPassword(event.target.value)} />
              <div>
                <PasswordField label="Nueva Contraseña" value={newPassword} maxLength={maxLength}
                  onChange={(event) => setNewPassword(event.target.value)} />
                {fieldErrors.newPassword && <p className={styles.fieldError} style={{color: COLORS.secondary}}>{fieldErrors.newPassword}</p>}
              </div>
              <div>
                <PasswordField label="Confirmar Nueva Contraseña" value={confirmPassword} maxLength={maxLength}
                  onChange={(event) => setConfirmPassword(event.target.value)} />
                {fieldErrors.confirmPassword && <p className={styles.fieldError} style={{color: COLORS.secondary}}>{fieldErrors.confirmPassword}</p>}
                {confirmPassword && newPassword && !fieldErrors.confirmPassword && (
                  <p className={styles.fieldError} style={{color: '#2d7a3a'}}>Las contraseñas coinciden</p>
                )}
              </div>
              {error && <InlineAlert type="error">{error}</InlineAlert>}
              <button className={styles.saveBtn}
                style={{backgroundColor: (loading || fieldErrors.newPassword || fieldErrors.confirmPassword) ? COLORS.fields : COLORS.secondary}}
                onClick={handleSave} disabled={loading || !!fieldErrors.newPassword || !!fieldErrors.confirmPassword}>
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
              <button className={styles.cancelBtn} style={{borderColor: COLORS.secondary, color: COLORS.secondary}} onClick={handleCancel}>
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SuccessModal isOpen={success} title="Actualizado" message="Contraseña actualizada correctamente" onAccept={closeSuccess} />
    </>
  );
}

export default ChangePasswordModal;