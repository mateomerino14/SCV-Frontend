import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  inputBox: "rounded-xl px-4 py-3 border w-full",
  inputRow: "flex items-center gap-2",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  sufijo: "text-sm font-bold font-inter",
}

function CampoGasto({ label, children, sufijo }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label} style={{ color: COLORS.labels }}>{label}</p>
      <div className={styles.inputBox} style={{ borderColor: COLORS.dataFields }}>
        <div className={styles.inputRow}>
          {children}
          {sufijo && (
            <span className={styles.sufijo} style={{ color: COLORS.labels }}>{sufijo}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampoGasto;