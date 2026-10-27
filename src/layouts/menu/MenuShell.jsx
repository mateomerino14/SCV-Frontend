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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0" style={{backgroundColor: COLORS.overlay}}
            variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
            transition={{duration: 0.2}} onClick={onClose} />
          <motion.div className="absolute top-0 left-0 h-screen w-72 flex flex-col shadow-2xl" style={{backgroundColor}}
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