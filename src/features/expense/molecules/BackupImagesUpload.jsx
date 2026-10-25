import {ImagePlus, X} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-2",
  label: "text-xs font-bold font-inter uppercase",
  hint: "text-xs font-inter",
  grid: "grid grid-cols-2 gap-2",
  thumb: "relative rounded-xl overflow-hidden border",
  thumbImg: "w-full h-32 object-contain",
  removeBtn: "absolute top-1 right-1 rounded-full p-1 shadow",
  addBox: "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 h-32 cursor-pointer",
  addLabel: "text-xs font-bold font-inter text-center px-2",
};

function BackupImagesUpload({images, onAdd, onRemove, max = 2, disabled = false}) {
  const canAdd = !disabled && images.length < max;
  const handleInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      onAdd(file);
      event.target.value = '';
    }
  };
  if (disabled && images.length === 0) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Respaldos (máx. {max})</p>
      <p className={styles.hint} style={{color: COLORS.labels}}>Por ejemplo, el comprobante del cambio de moneda.</p>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <div key={image.id} className={styles.thumb} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
            <img src={image.preview} alt={`respaldo ${index + 1}`} className={styles.thumbImg} />
            {!disabled && (
              <button type="button" aria-label={`Quitar respaldo ${index + 1}`} className={styles.removeBtn} style={{backgroundColor: COLORS.background, color: COLORS.secondary}} onClick={() => onRemove(image.id)}>
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        {canAdd && (
          <label className={styles.addBox} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
            <ImagePlus size={20} style={{color: COLORS.primary}} />
            <span className={styles.addLabel} style={{color: COLORS.text}}>Agregar respaldo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleInput} />
          </label>
        )}
      </div>
    </div>
  );
}

export default BackupImagesUpload;
