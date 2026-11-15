import {motion, AnimatePresence} from 'framer-motion';
import {Scale} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import FormField from '../../../components/ui/FormField';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-sm font-inter text-center',
  usdGrid: 'grid grid-cols-2 gap-3 items-end',
  typeGrid: 'grid grid-cols-[88px_1fr] gap-3 items-end',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  buttonsRow: 'flex gap-3 mt-2 justify-center',
  button: 'flex-1 py-3 px-8 rounded-xl font-bold font-nunito text-base cursor-pointer border-2 transition-colors',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function TravelScaleFormModal({mode, form, fieldErrors = {}, saving, error, onTypeChange, onAmountChange, onTextChange, onClose, onSave}) {
  return (
    <AnimatePresence>
      {mode && (
        <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              <ModalIconHeader icon={Scale} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />
              <p className={styles.title} style={{color: COLORS.text}}>{mode === 'create' ? 'Nuevo Tipo de Escala' : `Escala Tipo ${form.tipo}`}</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>
                {mode === 'create' ? 'Después podrás asignar este tipo a los cargos.' : 'Las tarifas nuevas se aplican a los viajes que se registren desde ahora.'}
              </p>
              {mode === 'create' ? (
                <div className={styles.typeGrid}>
                  <FormField label="Letra" required placeholder="D" maxLength={1}
                    value={form.tipo} onChange={onTypeChange} error={fieldErrors.tipo} />
                  <FormField label="Descripción" required placeholder="Ej: Consultores externos" maxLength={100}
                    value={form.descripcion} onChange={onTextChange('descripcion')} error={fieldErrors.descripcion} />
                </div>
              ) : (
                <FormField label="Descripción" required placeholder="Ej: Jefes de Área" maxLength={100}
                  value={form.descripcion} onChange={onTextChange('descripcion')} error={fieldErrors.descripcion} />
              )}
              <FormField label="Interior del País (Bs/día)" required type="text" inputMode="decimal" placeholder="0.00"
                value={form.monto_interior} onChange={onAmountChange('monto_interior')} error={fieldErrors.monto_interior} />
              <div className={styles.usdGrid}>
                <FormField label="Exterior Clase 1 (USD/día)" required type="text" inputMode="decimal" placeholder="0.00"
                  value={form.monto_clase_1_usd} onChange={onAmountChange('monto_clase_1_usd')} error={fieldErrors.monto_clase_1_usd} />
                <FormField label="Exterior Clase 2 (USD/día)" required type="text" inputMode="decimal" placeholder="0.00"
                  value={form.monto_clase_2_usd} onChange={onAmountChange('monto_clase_2_usd')} error={fieldErrors.monto_clase_2_usd} />
              </div>
              <FormField label="Hospedaje Permitido" required placeholder="Ej: Hasta 3 estrellas" maxLength={40}
                value={form.hospedaje} onChange={onTextChange('hospedaje')} error={fieldErrors.hospedaje} />
              {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
              <div className={styles.buttonsRow}>
                <button className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}} onClick={onClose} disabled={saving}>
                  Cancelar
                </button>
                <button className={styles.button} style={{backgroundColor: saving ? COLORS.fields : COLORS.secondary, borderColor: saving ? COLORS.fields : COLORS.secondary, color: COLORS.background}}
                  onClick={onSave} disabled={saving}>
                  {saving ? 'Guardando...' : (mode === 'create' ? 'Agregar' : 'Guardar')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TravelScaleFormModal;
