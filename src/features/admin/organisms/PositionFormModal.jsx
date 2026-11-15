import {motion, AnimatePresence} from 'framer-motion';
import {Briefcase} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import FormField from '../../../components/ui/FormField';
import ExistingNameSuggestions from '../molecules/ExistingNameSuggestions';
import ScaleTypePicker from '../molecules/ScaleTypePicker';
import {COLORS} from '../../../constants';
import usePositionFormModal from '../hooks/usePositionFormModal';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-sm font-inter text-center',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  buttonsRow: 'flex gap-3 mt-2 justify-center',
  cancelBtn: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
  confirmBtn: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PositionFormModal({isOpen, onClose, onConfirm, title, subtitle, btnLabel, formData, setFormData, scale = [], loading, error, fieldErrors = {}, setFieldErrors, suggestions = []}) {
  const {showSuggestions, setShowSuggestions, handleNameChange, handleTypeChange, handleSelectSuggestion} = usePositionFormModal(setFormData, setFieldErrors);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              <ModalIconHeader icon={Briefcase} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />
              <p className={styles.title} style={{color: COLORS.text}}>{title}</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>{subtitle}</p>
              <div>
                <FormField label="Nombre del Cargo" required placeholder="Ej: Especialista de Marketing" maxLength={100}
                  value={formData.nombre} onChange={handleNameChange} error={fieldErrors.nombre}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} />
                {showSuggestions && suggestions.length > 0 && (
                  <ExistingNameSuggestions suggestions={suggestions.map((position) => ({id: position.id_cargo, nombre: position.nombre}))} onSelect={handleSelectSuggestion} />
                )}
              </div>
              <ScaleTypePicker scale={scale} value={formData.tipo_viatico} onChange={handleTypeChange} error={fieldErrors.tipo_viatico} />
              {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
              <div className={styles.buttonsRow}>
                <button className={styles.cancelBtn} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}}
                  onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button className={styles.confirmBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary, borderColor: loading ? COLORS.fields : COLORS.secondary, color: COLORS.background}}
                  onClick={onConfirm} disabled={loading}>
                  {loading ? 'Guardando...' : btnLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PositionFormModal;