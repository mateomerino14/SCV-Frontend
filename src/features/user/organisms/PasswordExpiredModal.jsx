import {motion, AnimatePresence} from 'framer-motion';
import {KeyRound} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import PasswordField from '../../../components/ui/PasswordField';
import Button from '../../../components/ui/Button';
import usePasswordExpiredModal from '../hooks/usePasswordExpiredModal';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  subtitle: 'font-inter text-center text-sm',
  errorMsg: 'text-white text-sm font-inter italic text-center w-full',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
  fieldRow: 'w-full',
  fieldError: 'text-xs font-inter mt-1',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PasswordExpiredModal({isOpen, onConfirm, loading, error: externalError}) {
  const {
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    error, fieldErrors, handleConfirm,
  } = usePasswordExpiredModal(externalError);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <ModalIconHeader icon={KeyRound} backgroundColor={COLORS.background} color={COLORS.text} />
            <h2 className={styles.title} style={{color: COLORS.background}}>Actualiza tu Contraseña</h2>
            <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>
              Han pasado más de 90 días desde tu último cambio de contraseña. Por seguridad debes actualizarla para continuar.
            </p>
            <div className={styles.fieldRow}>
              <PasswordField label="Contraseña Actual" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)}
                borderColor={COLORS.backgroundOnColorBorder} labelColor={COLORS.backgroundOnColorText} textColor={COLORS.background}
                backgroundColor={COLORS.backgroundOnColorFill} iconColor={COLORS.backgroundOnColorText} />
            </div>
            <div className={styles.fieldRow}>
              <PasswordField label="Nueva Contraseña" value={newPassword} onChange={(event) => setNewPassword(event.target.value)}
                borderColor={COLORS.backgroundOnColorBorder} labelColor={COLORS.backgroundOnColorText} textColor={COLORS.background}
                backgroundColor={COLORS.backgroundOnColorFill} iconColor={COLORS.backgroundOnColorText} />
              {fieldErrors.newPassword && <p className={styles.fieldError} style={{color: '#ffd4d4'}}>{fieldErrors.newPassword}</p>}
            </div>
            <div className={styles.fieldRow}>
              <PasswordField label="Confirmar Nueva Contraseña" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                borderColor={COLORS.backgroundOnColorBorder} labelColor={COLORS.backgroundOnColorText} textColor={COLORS.background}
                backgroundColor={COLORS.backgroundOnColorFill} iconColor={COLORS.backgroundOnColorText} />
              {fieldErrors.confirmPassword && <p className={styles.fieldError} style={{color: '#ffd4d4'}}>{fieldErrors.confirmPassword}</p>}
              {confirmPassword && newPassword && !fieldErrors.confirmPassword && (
                <p className={styles.fieldError} style={{color: COLORS.background}}>Las contraseñas coinciden</p>
              )}
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.buttons}>
              <Button text={loading ? 'Guardando...' : 'Actualizar Contraseña'} variant="secondary"
                onClick={() => handleConfirm(onConfirm)}
                disabled={loading || !!fieldErrors.newPassword || !!fieldErrors.confirmPassword} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PasswordExpiredModal;