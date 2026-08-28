import {Upload} from 'lucide-react';
import {COLORS} from '../../../constants';
import useFileDropZone from '../hooks/useFileDropZone';

const styles = {
  wrapper: "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3",
  icon: "rounded-full p-4",
  title: "text-base font-bold font-inter text-center",
  subtitle: "text-xs font-inter text-center",
  buttonsRow: "flex flex-col gap-2 w-full mt-2",
  button: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors flex items-center justify-center gap-2",
};

function InvoiceDropZone({onFiles, onManual}) {
  const {handleDrop, handleDragOver, handleSelect} = useFileDropZone(onFiles);

  return (
    <div className={styles.wrapper} style={{borderColor: COLORS.fields, backgroundColor: COLORS.backgroundHeader}} onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className={styles.icon} style={{backgroundColor: COLORS.dataFields}}>
        <Upload size={28} style={{color: COLORS.primary}} />
      </div>

      <p className={styles.title} style={{color: COLORS.text}}>Arrastre su factura aquí</p>
      <p className={styles.subtitle} style={{color: COLORS.labels}}>Formatos aceptados: PDF, JPG, PNG. Tamaño máximo 10MB.</p>

      <div className={styles.buttonsRow}>
        <label className={styles.button} style={{backgroundColor: COLORS.primary, color: COLORS.background, border: 'none', cursor: 'pointer'}}>
          Tomar Foto
          <input type="file" accept="image/*" capture="environment" className="hidden" multiple onChange={handleSelect} />
        </label>

        <label className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent', cursor: 'pointer'}}>
          Seleccionar Archivos
          <input type="file" accept="image/*,application/pdf" className="hidden" multiple onChange={handleSelect} />
        </label>

        <button className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent', cursor: 'pointer'}} onClick={onManual}>
          Ingresar Manualmente
        </button>
      </div>
    </div>
  );
}

export default InvoiceDropZone;