import { Upload } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3",
  icon: "rounded-full p-4",
  title: "text-base font-bold font-inter text-center",
  subtitle: "text-xs font-inter text-center",
  btnsRow: "flex flex-col gap-2 w-full mt-2",
  btn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors flex items-center justify-center gap-2",
}

function DropZone({ onArchivos }) {
  const handleDrop = (e) => {
    e.preventDefault()
    onArchivos(e.dataTransfer.files)
  }

  const handleSeleccion = (e) => {
    onArchivos(e.target.files)
    e.target.value = ''
  }

  return (
    <div
      className={styles.wrapper}
      style={{ borderColor: COLORS.fields, backgroundColor: COLORS.backgroundHeader }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className={styles.icon} style={{ backgroundColor: COLORS.dataFields }}>
        <Upload size={28} style={{ color: COLORS.primary }} />
      </div>

      <p className={styles.title} style={{ color: COLORS.text }}>
        Arrastre su factura aquí
      </p>

      <p className={styles.subtitle} style={{ color: COLORS.labels }}>
        Formatos aceptados: PDF, JPG, PNG. Tamaño máximo 10MB.
      </p>

      <div className={styles.btnsRow}>
        <label
          className={styles.btn}
          style={{ backgroundColor: COLORS.primary, color: COLORS.background, border: 'none', cursor: 'pointer' }}
        >
          Tomar Foto
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleSeleccion}
            multiple
          />
        </label>

        <label
          className={styles.btn}
          style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent', cursor: 'pointer' }}
        >
          Seleccionar Archivos
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleSeleccion}
            multiple
          />
        </label>
      </div>
    </div>
  )
}

export default DropZone;