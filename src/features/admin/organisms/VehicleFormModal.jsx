import {motion, AnimatePresence} from 'framer-motion';
import {Car} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import FormField from '../../../components/ui/FormField';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-sm font-inter text-center',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  buttonsRow: 'flex gap-3 mt-2 justify-center',
  button: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function VehicleFormModal({isOpen, isEditing, onClose, onConfirm, formData, setFormData, loading, error, fieldErrors = {}, setFieldErrors}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({...prev, [field]: value}));
    setFieldErrors((prev) => ({...prev, [field]: undefined}));
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}} role="dialog" aria-label={isEditing ? 'Editar vehículo' : 'Registrar vehículo'}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              <ModalIconHeader icon={Car} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />
              <p className={styles.title} style={{color: COLORS.text}}>{isEditing ? 'Editar Vehículo' : 'Registrar Vehículo'}</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>Los vehículos activos y libres se ofrecen al crear un viaje en vehículo de la empresa.</p>
              <FormField label="Placa" required placeholder="Ej: 2345-ABC" maxLength={20}
                value={formData.placa} onChange={(event) => handleChange('placa', event.target.value.toUpperCase())} error={fieldErrors.placa} />
              <FormField label="Descripción" placeholder="Ej: Camioneta Toyota Hilux" maxLength={100}
                value={formData.descripcion} onChange={(event) => handleChange('descripcion', event.target.value)} error={fieldErrors.descripcion} />
              {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
              <div className={styles.buttonsRow}>
                <button className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}} onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button className={styles.button} style={{backgroundColor: loading ? COLORS.fields : COLORS.secondary, borderColor: loading ? COLORS.fields : COLORS.secondary, color: COLORS.background}}
                  onClick={onConfirm} disabled={loading}>
                  {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VehicleFormModal;
