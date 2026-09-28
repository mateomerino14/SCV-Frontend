import {useState, useEffect} from 'react';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import {X} from 'lucide-react';
import HardHatMascot from './HardHatMascot';
import {COLORS} from '../../constants';
import {isMascotEnabled, wasMascotSeen, markMascotSeen} from '../../utils/mascotPreferences';

const styles = {
  wrapper: 'fixed bottom-4 right-4 z-40 flex items-end gap-2 pointer-events-none',
  bubble: 'relative max-w-[240px] rounded-2xl px-4 py-3 shadow-lg pointer-events-auto mb-10',
  bubbleName: 'text-[11px] font-bold font-inter uppercase tracking-wide mb-1',
  bubbleText: 'text-sm font-inter leading-snug',
  closeBtn: 'absolute -top-2 -right-2 rounded-full p-1 shadow cursor-pointer',
  mascot: 'pointer-events-auto cursor-pointer',
};

const appearDelay = 1500;
const visibleTime = 9000;

// Casquito entra por la esquina inferior derecha, dice el mensaje de la pantalla y se va.
// Aparece una sola vez por pantalla y sesion, solo si el mensaje ya esta listo, si el
// usuario no lo desactivo en Ajustes de Cuenta y si no pidio reducir el movimiento.
function MascotGreeting({pageKey, message}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message || reduceMotion || !isMascotEnabled() || wasMascotSeen(pageKey)) {
      return undefined;
    }
    const showTimer = setTimeout(() => {
      markMascotSeen(pageKey);
      setVisible(true);
    }, appearDelay);
    const hideTimer = setTimeout(() => setVisible(false), appearDelay + visibleTime);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pageKey, message, reduceMotion]);

  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className={styles.wrapper}
          initial={{x: 160, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 160, opacity: 0}}
          transition={{type: 'spring', stiffness: 120, damping: 16}}>
          <motion.div className={styles.bubble} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}
            initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: 0.35, duration: 0.2}}>
            <button className={styles.closeBtn} style={{backgroundColor: COLORS.primary}} onClick={close} aria-label="Cerrar">
              <X size={12} style={{color: COLORS.background}} />
            </button>
            <p className={styles.bubbleName} style={{color: COLORS.primary}}>Casquito</p>
            <p className={styles.bubbleText} style={{color: COLORS.text}}>{message}</p>
          </motion.div>
          <motion.div className={styles.mascot} onClick={close} title="Cerrar"
            animate={{y: [0, -6, 0]}} transition={{duration: 1.1, repeat: Infinity, ease: 'easeInOut'}}>
            <HardHatMascot />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MascotGreeting;
