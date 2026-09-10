import {motion, AnimatePresence} from 'framer-motion';
import {Clock} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import Button from '../../../components/ui/Button';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  label: 'font-inter text-center text-sm m-3',
  buttons: 'flex flex-row gap-4 mt-2',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SessionExpiredModal({isOpen, onClose}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <ModalIconHeader icon={Clock} backgroundColor={COLORS.backgroundSecondary} color={COLORS.background} />
            <h2 className={styles.title} style={{color: COLORS.background}}>Sesión Expirada</h2>
            <span className={styles.label} style={{color: COLORS.backgroundHeader}}>Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</span>
            <div className={styles.buttons}>
              <Button text="Iniciar Sesión" variant="secondary" onClick={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SessionExpiredModal;