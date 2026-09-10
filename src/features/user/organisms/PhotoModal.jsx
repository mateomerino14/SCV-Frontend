import {motion, AnimatePresence} from 'framer-motion';
import {Camera} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-80 gap-3',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  label: 'font-inter text-center text-sm',
  btn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PhotoModal({isOpen, onClose, onNewPhoto, onRemove, saving}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <ModalIconHeader icon={Camera} size={40} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
            <h2 className={styles.title} style={{color: COLORS.background}}>Foto de Perfil</h2>
            <p className={styles.label} style={{color: COLORS.backgroundHeader}}>¿Qué deseas hacer con tu foto de perfil?</p>
            <div className="flex flex-col gap-2 w-full mt-2">
              <label className={styles.btn} style={{backgroundColor: COLORS.background, color: COLORS.secondary, cursor: saving ? 'not-allowed' : 'pointer'}}>
                Actualizar foto
                <input type="file" accept="image/*" className="hidden" disabled={saving}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      onNewPhoto(file);
                      event.target.value = '';
                    }
                  }} />
              </label>
              <button className={styles.btn} style={{backgroundColor: COLORS.background, color: COLORS.secondary}} onClick={onRemove} disabled={saving}>
                Quitar foto
              </button>
              <button className={styles.btn} style={{backgroundColor: COLORS.secondary, color: COLORS.background}} onClick={onClose}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhotoModal;