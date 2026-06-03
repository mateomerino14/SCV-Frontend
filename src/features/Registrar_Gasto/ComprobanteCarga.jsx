import { Camera, Trash2 } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  dropZone: "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 p-6 cursor-pointer",
  iconWrapper: "rounded-full p-3",
  dropLabel: "text-sm font-bold font-inter text-center",
  dropSub: "text-xs font-inter text-center",
  previewWrapper: "rounded-xl overflow-hidden border flex flex-col",
  previewImg: "w-full object-contain",
  eliminarBtn: "w-full py-2.5 font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 border-t",
}

function ComprobanteCarga({ previewImagen, onChange, onEliminar }) {
  const handleInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      onChange(file)
      e.target.value = ''
    }
  }

  if (previewImagen) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.label} style={{ color: COLORS.labels }}>Comprobante</p>
        <div
          className={styles.previewWrapper}
          style={{ borderColor: COLORS.dataFields }}
        >
          <img
            src={previewImagen}
            alt="comprobante"
            className={styles.previewImg}
            style={{
              height: '350px',
              backgroundColor: COLORS.backgroundHeader,
            }}
          />
          <button
            className={styles.eliminarBtn}
            style={{
              borderColor: COLORS.dataFields,
              color: COLORS.secondary,
              backgroundColor: COLORS.background,
            }}
            onClick={onEliminar}
          >
            <Trash2 size={14} />
            Quitar comprobante
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: COLORS.labels }}>Comprobante</p>
      <label
        className={styles.dropZone}
        style={{
          borderColor: COLORS.dataFields,
          backgroundColor: COLORS.backgroundHeader,
          cursor: 'pointer',
        }}
      >
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.dataFields }}>
          <Camera size={24} style={{ color: COLORS.primary }} />
        </div>
        <p className={styles.dropLabel} style={{ color: COLORS.text }}>
          Subir Foto o Archivo
        </p>
        <p className={styles.dropSub} style={{ color: COLORS.labels }}>
          JPG, PNG o PDF (Máx 5MB)
        </p>
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleInput}
        />
      </label>
    </div>
  )
}

export default ComprobanteCarga;