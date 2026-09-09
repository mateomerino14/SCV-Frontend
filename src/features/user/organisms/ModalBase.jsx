import {motion, AnimatePresence} from 'framer-motion';

const styles = {
  overlay: "fixed inset-0 flex items-center justify-center z-50",
  container: "rounded-2xl p-10 w-[90%] max-w-sm text-white text-center flex flex-col items-center gap-4 shadow-2xl",
};

const backdropVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

const cardVariants = {
  hidden: {opacity: 0, scale: 0.94, y: 8},
  visible: {opacity: 1, scale: 1, y: 0},
};

function ModalBase({isOpen, children}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)'}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.container} style={{backgroundColor: '#870002'}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModalBase;