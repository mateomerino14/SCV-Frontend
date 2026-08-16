import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 relative",
  label: "text-xs font-bold font-inter uppercase mb-3",
  trigger: "w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer",
  triggerTexto: "text-sm font-inter",
  dropdown: "absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden",
  lista: "max-h-48 overflow-y-auto",
  opcion: "px-4 py-2.5 text-sm font-inter cursor-pointer",
  errorCampo: "text-xs font-inter mt-1",
}

function SelectorMoneda({ monedas, moneda, onChange, error }) {
  const [abierto, setAbierto] = useState(false)
  const [abreArriba, setAbreArriba] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)

  const monedaSeleccionada = monedas.find((m) => m.codigo === moneda)

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const handleToggle = () => {
    if (!abierto && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const espacioAbajo = window.innerHeight - rect.bottom
      setAbreArriba(espacioAbajo < 220)
    }
    setAbierto(!abierto)
  }

  const handleSeleccionar = (m) => {
    onChange(m.codigo)
    setAbierto(false)
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <p className={styles.label} style={{ color: COLORS.labels }}>Moneda</p>
      <div
        ref={triggerRef}
        className={styles.trigger}
        style={{
          borderColor: error ? '#f87171' : COLORS.dataFields,
          borderWidth: error ? '1.5px' : '1px',
          backgroundColor: COLORS.background,
        }}
        onClick={handleToggle}
      >
        <span className={styles.triggerTexto} style={{ color: monedaSeleccionada ? COLORS.text : COLORS.labels }}>
          {monedaSeleccionada ? `${monedaSeleccionada.codigo} — ${monedaSeleccionada.nombre}` : 'Seleccione una moneda'}
        </span>
        {abierto
          ? <ChevronUp size={16} style={{ color: COLORS.labels }} />
          : <ChevronDown size={16} style={{ color: COLORS.labels }} />
        }
      </div>
      {error && <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{error}</p>}
      {abierto && (
        <div
          className={styles.dropdown}
          style={{
            borderColor: COLORS.dataFields,
            backgroundColor: COLORS.background,
            bottom: abreArriba ? '100%' : 'auto',
            top: abreArriba ? 'auto' : '100%',
            marginBottom: abreArriba ? '4px' : '0',
            marginTop: abreArriba ? '0' : '4px',
          }}
        >
          <div className={styles.lista}>
            {monedas.map((m) => (
              <div
                key={m.codigo}
                className={styles.opcion}
                style={{
                  color: moneda === m.codigo ? COLORS.background : COLORS.text,
                  backgroundColor: moneda === m.codigo ? COLORS.primary : 'transparent',
                  fontWeight: moneda === m.codigo ? 'bold' : 'normal',
                }}
                onClick={() => handleSeleccionar(m)}
                onMouseEnter={(e) => {
                  if (moneda !== m.codigo) e.currentTarget.style.backgroundColor = COLORS.backgroundHeader
                }}
                onMouseLeave={(e) => {
                  if (moneda !== m.codigo) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {m.codigo} — {m.nombre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectorMoneda;