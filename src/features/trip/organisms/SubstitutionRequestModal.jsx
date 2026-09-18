import {motion, AnimatePresence} from 'framer-motion';
import {Users} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import InlineDropdown from '../../../components/ui/InlineDropdown';
import {COLORS} from '../../../constants';
import useSimpleSelector from '../../../hooks/shared/useSimpleSelector';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  headerRow: 'flex items-center gap-3',
  title: 'text-lg font-bold font-inter leading-tight',
  subtitle: 'text-xs font-inter mt-0.5',
  errorMsg: 'text-xs font-inter italic text-center w-full py-2 px-3 rounded-xl',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SubstitutionRequestModal({isOpen, onClose, onConfirm, substituteId, onSelectSubstitute, employees, loading, error}) {
  const {open, opensUpward, wrapperRef, triggerRef, toggle, close} = useSimpleSelector();
  const selectedEmployee = employees.find((employee) => String(employee.id_usuario) === String(substituteId));
  const label = selectedEmployee ? `${selectedEmployee.nombre} ${selectedEmployee.apellido_paterno}` : 'Selecciona un empleado...';
  const options = employees.map((employee) => ({value: employee.id_usuario, label: `${employee.nombre} ${employee.apellido_paterno}`}));
  const handleConfirm = () => onConfirm(substituteId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.headerRow}>
              <ModalIconHeader icon={Users} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
              <div>
                <p className={styles.title} style={{color: COLORS.background}}>Solicitar Reemplazo</p>
                <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>Elige quién rendirá los gastos de este viaje en tu lugar. Un revisor debe aprobarlo.</p>
              </div>
            </div>
            {employees.length === 0 ? (
              <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>No hay otros empleados disponibles para designar como reemplazo.</p>
            ) : (
              <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} opensUpward={opensUpward} onToggle={toggle}
                label={label} options={options} selectedValue={substituteId}
                onSelect={(value) => {onSelectSubstitute(value); close();}} />
            )}
            {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.background}}>{error}</p>}
            <ModalActions onCancel={onClose} onConfirm={handleConfirm} confirmLabel={loading ? 'Enviando...' : 'Enviar Solicitud'}
              loading={loading} confirmDisabled={!substituteId} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SubstitutionRequestModal;
