import {ImagePlus, Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-2",
  label: "text-xs font-bold font-inter uppercase",
  hint: "text-xs font-inter",
  grid: "grid grid-cols-2 gap-2",
  thumb: "rounded-xl overflow-hidden border flex flex-col",
  thumbLink: "block",
  thumbImg: "w-full h-56 sm:h-80 object-contain",
  thumbHint: "text-[11px] font-inter text-center py-1.5",
  removeBtn: "w-full py-2.5 font-bold font-nunito text-sm flex items-center justify-center gap-2 border-t cursor-pointer",
  addBox: "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 h-full min-h-56 sm:min-h-80 cursor-pointer",
  addLabel: "text-xs font-bold font-inter text-center px-2",
};

function BackupImagesUpload({images, onAdd, onRemove, max = 2, disabled = false, allowAdd = true}) {
  const canAdd = !disabled && allowAdd && images.length < max;
  const handleInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      onAdd(file);
      event.target.value = '';
    }
  };
  if ((disabled || !allowAdd) && images.length === 0) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Respaldos (máx. {max})</p>
      <p className={styles.hint} style={{color: COLORS.labels}}>Por ejemplo, el comprobante del cambio de moneda.</p>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <div key={image.id} className={styles.thumb} style={{borderColor: COLORS.dataFields}}>
            <a href={image.preview} target="_blank" rel="noreferrer" className={styles.thumbLink} title="Abrir en tamaño completo">
              <img src={image.preview} alt={`respaldo ${index + 1}`} className={styles.thumbImg} style={{backgroundColor: COLORS.backgroundHeader}} />
            </a>
            <p className={styles.thumbHint} style={{color: COLORS.labels, backgroundColor: COLORS.backgroundHeader}}>Toca la imagen para verla en tamaño completo</p>
            {!disabled && (
              <button type="button" aria-label={`Quitar respaldo ${index + 1}`} className={styles.removeBtn} style={{borderColor: COLORS.dataFields, color: COLORS.secondary, backgroundColor: COLORS.background}} onClick={() => onRemove(image.id)}>
                <Trash2 size={14} />
                Quitar respaldo
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
