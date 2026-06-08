import { Trash2 } from "lucide-react"
import Button from "../../components/ui/Button"
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-80 gap-2',
  iconWrapper: 'rounded-full p-4',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  label: 'font-inter text-center text-sm m-3',
  warning: 'font-inter text-center text-xs px-2',
  buttons: 'flex flex-row gap-4 mt-2',
}

function EliminarFacturaModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>

        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <Trash2 size={50} style={{ color: COLORS.backgroundSecondary }} />
        </div>

        <h2 className={styles.title} style={{ color: COLORS.background }}>
          Quitar Factura
        </h2>

        <span className={styles.label} style={{ color: COLORS.background }}>
          ¿Estás seguro de que deseas quitar esta factura de la lista?
        </span>

        <span className={styles.warning} style={{ color: COLORS.backgroundHeader }}>
          La factura no se guardará y los datos extraídos se perderán.
        </span>

        <div className={styles.buttons}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button text="Aceptar" variant="primary" onClick={onConfirm} />
        </div>

      </div>
    </div>
  )
}

export default EliminarFacturaModal;