import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 mb-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  inputWrapper: "flex items-center gap-3 rounded-xl px-4 py-3",
  errorCampo: "text-xs font-inter mt-1",
}

function InputField({ label, icon, children, error, ...wrapperProps }) {
  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label} style={{ color: COLORS.labels }}>{label}</p>}
      <div
        className={styles.inputWrapper}
        style={{
          backgroundColor: COLORS.dataFields,
          border: error ? '1.5px solid #f87171' : '1.5px solid transparent',
          ...wrapperProps.style,
        }}
      >
        {icon && icon}
        {children}
      </div>
      {error && <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

export default InputField;