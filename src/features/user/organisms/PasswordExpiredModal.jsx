import {useState, useEffect} from 'react';
import {KeyRound} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import PasswordField from '../../../components/ui/PasswordField';
import Button from '../../../components/ui/Button';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-3 shadow-xl',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  subtitle: 'font-inter text-center text-sm',
  errorMsg: 'text-white text-sm font-inter italic text-center w-full',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
};

function PasswordExpiredModal({isOpen, onConfirm, loading, error: externalError}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Completa todos los campos requeridos');
      return;
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword === currentPassword) {
      setError('La nueva contraseña no puede ser igual a la actual');
      return;
    }
    setError('');
    onConfirm(currentPassword, newPassword);
  };

  return (
    <div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
      <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
        <ModalIconHeader icon={KeyRound} backgroundColor={COLORS.background} color={COLORS.text} />
        <h2 className={styles.title} style={{color: COLORS.background}}>Actualiza tu Contraseña</h2>
        <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>
          Han pasado más de 90 días desde tu último cambio de contraseña. Por seguridad debes actualizarla para continuar.
        </p>
        <PasswordField label="Contraseña Actual" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} borderColor="rgba(255,255,255,0.3)" />
        <PasswordField label="Nueva Contraseña" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} borderColor="rgba(255,255,255,0.3)" />
        <PasswordField label="Confirmar Nueva Contraseña" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} borderColor="rgba(255,255,255,0.3)" />
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.buttons}>
          <Button text={loading ? 'Guardando...' : 'Actualizar Contraseña'} variant="secondary" onClick={handleConfirm} disabled={loading} />
        </div>
      </div>
    </div>
  );
}

export default PasswordExpiredModal;