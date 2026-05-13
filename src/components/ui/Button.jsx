import { COLORS } from '../../constants/index';

const styles = {
  primary: "bg-red-600 text-white hover:bg-red-700 font-bold font-nunito text-md px-5 py-2.5 rounded-lg transition-colors",
  secondary: "bg-white text-red-600 hover:bg-red-50 border font-bold font-nunito text-md px-5 py-2.5 rounded-lg transition-colors",
}

function Button({ text, variant = 'primary', onClick, disabled = false }) {
  const baseStyles = variant === 'primary' ? styles.primary : styles.secondary;
  
  return (
    <button
      className={baseStyles}
      style={{ 
        borderColor: variant === 'secondary' ? COLORS.primary : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button;