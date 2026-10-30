import {useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {COLORS} from '../../constants';

const backdropVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

const drawerVariants = {
  hidden: {x: '-100%'},
  visible: {x: 0},
};

function MenuShell({isOpen, onClose, backgroundColor, children}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 h-dvh overflow-hidden overscroll-none">
          <motion.div className="absolute inset-0" style={{backgroundColor: COLORS.overlay}}
            variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{duration: 0.2}} onClick={onClose} />
          <motion.div className="absolute inset-y-0 left-0 h-dvh max-h-dvh w-72 max-w-[85vw] flex flex-col shadow-2xl" style={{backgroundColor}}
            variants={drawerVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1]}}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MenuShell;