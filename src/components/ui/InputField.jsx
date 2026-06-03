import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 mb-1",
  label: "text-xs font-bold font-inter uppercase mb-3",
  inputWrapper: "flex items-center gap-3 rounded-xl px-4 py-3",
  input: "bg-transparent w-full outline-none font-inter text-sm",
}

function InputField({ label, icon, children, ...wrapperProps }) {
  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label} style={{ color: COLORS.labels }}>{label}</p>}
      <div className={styles.inputWrapper} style={{ backgroundColor: COLORS.dataFields, ...wrapperProps.style }}>
        {icon && icon}
        {children}
      </div>
    </div>
  )
}

export default InputField