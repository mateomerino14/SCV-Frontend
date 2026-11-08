import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import SignaturePad from '../../../components/ui/SignaturePad';
import PasswordField from '../../../components/ui/PasswordField';
import InlineAlert from '../../../components/ui/InlineAlert';
import Button from '../../../components/ui/Button';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm px-4',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm gap-4 shadow-xl max-h-[94dvh] overflow-y-auto',
  title: 'text-2xl font-bold font-inter',
  subtitle: 'text-sm font-inter -mt-2',
  buttons: 'flex flex-col gap-2',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SignatureSetupCard({hasSignature, onSave, onClose}) {
  const [drawn, setDrawn] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  let title = 'Registrar Firma';
  if (hasSignature) {
    title = 'Cambiar Firma';
  }
  let saveLabel = 'Guardar firma';
  if (saving) {
    saveLabel = 'Guardando...';
  }

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(drawn, password);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose(true);
  };

  return (
    <motion.div className={styles.card} style={{backgroundColor: COLORS.background}} role="dialog" aria-label={title}
      variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
      <p className={styles.title} style={{color: COLORS.text}}>{title}</p>
      <p className={styles.subtitle} style={{color: COLORS.labels}}>Dibuja tu firma: se usará en los memorándums, planillas y documentos que firmes. Los documentos ya firmados no cambian.</p>
      <SignaturePad onChange={setDrawn} disabled={saving} />
      <PasswordField required label="Tu contraseña" value={password} maxLength={100} onChange={(event) => setPassword(event.target.value)} />
      {error && <InlineAlert type="error">{error}</InlineAlert>}
      <div className={styles.buttons}>
        <Button text={saveLabel} onClick={handleSave} disabled={saving || !drawn || password === ''} />
        <Button text="Cancelar" variant="outline" onClick={() => onClose(false)} disabled={saving} />
      </div>
    </motion.div>
  );
}

function SignatureSetupModal({isOpen, hasSignature, onSave, onClose}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <SignatureSetupCard hasSignature={hasSignature} onSave={onSave} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignatureSetupModal;
