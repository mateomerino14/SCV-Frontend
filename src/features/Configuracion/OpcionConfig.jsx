import { ChevronRight } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex items-center justify-between p-4 rounded-2xl cursor-pointer shadow-sm",
  left: "flex items-center gap-3",
  iconWrapper: "rounded-full p-2",
  label: "text-sm font-bold font-inter",
}

function OpcionConfig({ icono: Icono, label, onClick }) {
  return (
    <div
      className={styles.wrapper}
      style={{ backgroundColor: COLORS.background, border:`1px solid ${COLORS.fields}`}}
      onClick={onClick}
    >
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.error }}>
          <Icono size={18} style={{ color: COLORS.secondary }} />
        </div>
        <p className={styles.label} style={{ color: COLORS.text }}>{label}</p>
      </div>
      <ChevronRight size={18} style={{ color: COLORS.labels }} />
    </div>
  )
}

export default OpcionConfig;