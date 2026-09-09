import {motion, AnimatePresence} from 'framer-motion';
import {Clock} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-3 shadow-xl items-center',
  title: 'text-lg font-bold font-inter leading-tight text-center',
  message: 'text-sm font-inter text-center leading-relaxed',
  acceptBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer text-center mt-2',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function DeadlineExpiredNoticeModal({isOpen, onClose}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <ModalIconHeader icon={Clock} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
            <p className={styles.title} style={{color: COLORS.background}}>Plazo Vencido</p>
            <p className={styles.message} style={{color: COLORS.backgroundHeader}}>
              El plazo para registrar gastos de este viaje ha vencido. Para continuar registrando, solicita una autorización al revisor desde el botón al final de la página.
            </p>
            <button className={styles.acceptBtn} style={{backgroundColor: COLORS.background, color: COLORS.primary}} onClick={onClose}>
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DeadlineExpiredNoticeModal;