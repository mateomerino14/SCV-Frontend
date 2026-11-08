import {useState} from 'react';
import {PenLine} from 'lucide-react';
import ProfileSectionTitle from '../molecules/ProfileSectionTitle';
import SignatureSetupModal from './SignatureSetupModal';
import SuccessModal from '../../../components/ui/SuccessModal';
import Button from '../../../components/ui/Button';
import useStoredSignature from '../../../hooks/user/useStoredSignature';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-6 shadow-sm border mt-6',
  body: 'flex flex-col sm:flex-row sm:items-center gap-4',
  preview: 'flex-1 rounded-xl border flex items-center justify-center p-3 min-h-28',
  image: 'h-24 max-w-full object-contain',
  empty: 'flex flex-col items-center gap-1 text-sm font-inter text-center',
  date: 'text-xs font-inter mt-2',
  action: 'sm:w-56 flex',
};

const updatedDateOf = (signature) => new Date(signature.fecha_actualizacion).toLocaleDateString('es-BO', {timeZone: 'America/La_Paz', day: '2-digit', month: '2-digit', year: 'numeric'});

function SignatureSettingsCard() {
  const {signature, loading, loadError, save} = useStoredSignature(true);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  let actionText = 'Registrar firma';
  if (signature) {
    actionText = 'Cambiar firma';
  }

  let preview = <p className={styles.empty} style={{color: COLORS.labels}}>Cargando tu firma...</p>;
  if (!loading && loadError) {
    preview = <p className={styles.empty} style={{color: COLORS.fieldError}}>{loadError}</p>;
  }
  else if (!loading && signature) {
    preview = <img src={signature.imagen} alt="Tu firma digital" className={styles.image} />;
  }
  else if (!loading) {
    preview = (
      <div className={styles.empty} style={{color: COLORS.labels}}>
        <PenLine size={22} style={{color: COLORS.primary}} />
        Aún no registraste tu firma digital. La necesitas para aprobar, enviar y revisar viajes y rendiciones.
      </div>
    );
  }

  const handleClose = (wasSaved) => {
    setEditing(false);
    setSaved(wasSaved);
  };

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}>
      <ProfileSectionTitle>Firma Digital</ProfileSectionTitle>
      <div className={styles.body}>
        <div className={styles.preview} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>{preview}</div>
        <div className={styles.action}>
          <Button text={actionText} variant="outline" onClick={() => setEditing(true)} disabled={loading || !!loadError} />
        </div>
      </div>
      {signature && <p className={styles.date} style={{color: COLORS.labels}}>Registrada el {updatedDateOf(signature)}. Se firma con tu contraseña.</p>}
      <SignatureSetupModal isOpen={editing} hasSignature={!!signature} onSave={save} onClose={handleClose} />
      <SuccessModal isOpen={saved} title="Firma guardada" message="Tu firma digital quedó registrada." onAccept={() => setSaved(false)} />
    </div>
  );
}

export default SignatureSettingsCard;
