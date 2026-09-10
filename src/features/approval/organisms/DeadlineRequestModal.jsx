import {motion, AnimatePresence} from 'framer-motion';
import {Clock} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import LimitedTextarea from '../../../components/ui/LimitedTextarea';
import {COLORS} from '../../../constants';
import useDeadlineRequestModal from '../hooks/useDeadlineRequestModal';

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

function DeadlineRequestModal({isOpen, onClose, onConfirm, loading, error}) {
  const {reason, setReason, maxLength, exceedsLimit, handleConfirm} = useDeadlineRequestModal(isOpen, onConfirm);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.headerRow}>
              <ModalIconHeader icon={Clock} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
              <div>
                <p className={styles.title} style={{color: COLORS.background}}>Solicitar Autorización</p>
                <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>Explica al revisor por qué necesitas registrar gastos fuera del plazo permitido.</p>
              </div>
            </div>
            <LimitedTextarea value={reason} maxLength={maxLength} exceedsLimit={exceedsLimit} error={error} rows={4}
              placeholder="Ej: Estuve de licencia médica y no pude cargar los gastos a tiempo..."
              onChange={(event) => setReason(event.target.value)} />
            <ModalActions onCancel={onClose} onConfirm={handleConfirm} confirmLabel={loading ? 'Enviando...' : 'Enviar Solicitud'}
              loading={loading} confirmDisabled={!reason.trim() || exceedsLimit} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DeadlineRequestModal;