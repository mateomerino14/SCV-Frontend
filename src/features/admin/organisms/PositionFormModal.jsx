import {motion, AnimatePresence} from 'framer-motion';
import {Briefcase} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import FormField from '../../../components/ui/FormField';
import PositionNameSuggestions from '../molecules/PositionNameSuggestions';
import {COLORS} from '../../../constants';
import usePositionFormModal from '../hooks/usePositionFormModal';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-sm font-inter text-center',
  currencyGrid: 'grid grid-cols-2 gap-3',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  buttonsRow: 'flex gap-3 mt-2 justify-center',
  cancelBtn: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
  confirmBtn: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PositionFormModal({isOpen, onClose, onConfirm, title, subtitle, btnLabel, formData, setFormData, loading, error, fieldErrors = {}, setFieldErrors, suggestions = []}) {
  const {showSuggestions, setShowSuggestions, handleNameChange, handleAmountChange, handleAmountKeyDown, handleSelectSuggestion} = usePositionFormModal(setFormData, setFieldErrors);
  const monthlyImpact = formData.monto_diario ? (parseFloat(formData.monto_diario) * 30).toFixed(2) : '0.00';
  const monthlyImpactUsd = formData.monto_diario_usd ? (parseFloat(formData.monto_diario_usd) * 30).toFixed(2) : '0.00';
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: 'rgba(0,0,0,0.4)'}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              <ModalIconHeader icon={Briefcase} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />
              <p className={styles.title} style={{color: COLORS.text}}>{title}</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>{subtitle}</p>
              <div>
                <FormField label="Nombre del Cargo" placeholder="Ej: Especialista de Marketing" maxLength={50}
                  value={formData.nombre} onChange={handleNameChange} error={fieldErrors.nombre}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} />
                {showSuggestions && suggestions.length > 0 && (
                  <PositionNameSuggestions suggestions={suggestions} onSelect={handleSelectSuggestion} />
                )}
              </div>
              <div className={styles.currencyGrid}>
                <FormField label="Tarifa/Día (Bs.)" type="text" inputMode="decimal" placeholder="0.00"
                  value={formData.monto_diario} onChange={handleAmountChange('monto_diario')} onKeyDown={handleAmountKeyDown}
                  error={fieldErrors.monto_diario} helperText={parseFloat(formData.monto_diario) > 0 ? `~Bs. ${monthlyImpact}/mes` : null} />
                <FormField label="Tarifa/Día (USD)" type="text" inputMode="decimal" placeholder="0.00"
                  value={formData.monto_diario_usd || ''} onChange={handleAmountChange('monto_diario_usd')} onKeyDown={handleAmountKeyDown}
                  error={fieldErrors.monto_diario_usd} helperText={parseFloat(formData.monto_diario_usd) > 0 ? `~USD ${monthlyImpactUsd}/mes` : null} />
              </div>
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