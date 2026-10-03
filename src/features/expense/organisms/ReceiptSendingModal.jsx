import {motion, AnimatePresence} from 'framer-motion';
import {Loader2} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm px-4',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs gap-2 shadow-xl',
  iconWrapper: 'rounded-full flex items-center justify-center',
  title: 'text-lg font-bold font-inter text-center mt-3',
  message: 'font-inter text-center text-sm m-3',
};

// Aviso mientras se genera el recibo y se envia al correo del empleado
function ReceiptSendingModal({isOpen}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            initial={{opacity: 0, scale: 0.94, y: 8}} animate={{opacity: 1, scale: 1, y: 0}} exit={{opacity: 0, scale: 0.94, y: 8}}
            transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.iconWrapper} style={{width: 40, height: 40, backgroundColor: COLORS.background}}>
              <Loader2 size={22} className="animate-spin" style={{color: COLORS.primary}} />
            </div>
            <h2 className={styles.title} style={{color: COLORS.background}}>Enviando recibo</h2>
            <p className={styles.message} style={{color: COLORS.background}}>
              Estamos generando el recibo y enviándolo a tu correo. Esto puede tardar unos segundos.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReceiptSendingModal;
