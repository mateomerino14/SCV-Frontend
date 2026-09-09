import {Camera, Trash2} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  dropZone: "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 p-6",
  iconWrapper: "rounded-full p-3",
  dropLabel: "text-sm font-bold font-inter text-center",
  dropSub: "text-xs font-inter text-center",
  previewWrapper: "rounded-xl overflow-hidden border flex flex-col",
  previewImg: "w-full object-contain",
  removeBtn: "w-full py-2.5 font-bold font-nunito text-sm flex items-center justify-center gap-2 border-t",
  fieldError: "text-xs font-inter mt-1",
};

function ReceiptUpload({previewImage, onChange, onRemove, error, disabled}) {
  const handleInput = (event) => {
    if (disabled) {
      return;
    }
    const file = event.target.files[0];
    if (file) {
      onChange(file);
      event.target.value = '';
    }
  };
  if (previewImage) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.label} style={{color: COLORS.labels}}>Comprobante</p>
        <div className={styles.previewWrapper} style={{borderColor: COLORS.dataFields}}>
          <img src={previewImage} alt="comprobante" className={styles.previewImg} style={{height: '350px', backgroundColor: COLORS.backgroundHeader}} />
          {!disabled && (
            <button className={styles.removeBtn} style={{borderColor: COLORS.dataFields, color: COLORS.secondary, backgroundColor: COLORS.background, cursor: 'pointer'}} onClick={onRemove}>
              <Trash2 size={14} />
              Quitar comprobante
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{color: COLORS.labels}}>Comprobante</p>
      <label className={styles.dropZone} style={{
        borderColor: error ? '#f87171' : COLORS.dataFields,
        backgroundColor: disabled ? COLORS.backgroundHeader : COLORS.backgroundHeader,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}>
        <div className={styles.iconWrapper} style={{backgroundColor: COLORS.dataFields}}>
          <Camera size={24} style={{color: disabled ? COLORS.fields : COLORS.primary}} />
        </div>
        <p className={styles.dropLabel} style={{color: disabled ? COLORS.labels : COLORS.text}}>
          {disabled ? 'Sin comprobante' : 'Subir Foto o Archivo'}
        </p>
        {!disabled && <p className={styles.dropSub} style={{color: COLORS.labels}}>JPG, PNG o PDF (Máx 5MB)</p>}
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleInput} disabled={disabled} />
      </label>
      {error && <p className={styles.fieldError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

export default ReceiptUpload;