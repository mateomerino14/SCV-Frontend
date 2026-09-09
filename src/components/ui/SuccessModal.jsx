import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircle2} from 'lucide-react';
import ModalIconHeader from './ModalIconHeader';
import Button from './Button';
import {COLORS} from '../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  message: 'font-inter text-center text-sm m-3',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SuccessModal({isOpen, title = 'Éxito', message, onAccept}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <ModalIconHeader icon={CheckCircle2} backgroundColor={COLORS.background} color="#000000" />
            <h2 className={styles.title} style={{color: COLORS.background}}>{title}</h2>
            <p className={styles.message} style={{color: COLORS.backgroundHeader}}>{message}</p>
            <Button text="Aceptar" variant="secondary" onClick={onAccept} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SuccessModal;