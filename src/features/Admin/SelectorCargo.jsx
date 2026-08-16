import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronUp, Search, Check } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "relative",
  label: "text-xs font-bold font-inter uppercase mb-1",
  dropdownBtn: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter flex items-center justify-between cursor-pointer',
  dropdownMenu: 'fixed z-[10000] rounded-xl border shadow-lg overflow-hidden',
  buscadorWrapper: "flex items-center gap-2 px-3 py-2 border-b",
  buscadorInput: "w-full text-sm font-inter outline-none bg-transparent",
  lista: "max-h-52 overflow-y-auto",
  dropdownItem: 'flex items-center justify-between px-3 py-2.5 text-sm font-inter cursor-pointer',
  vacio: "px-4 py-3 text-sm font-inter text-center",
  errorCampo: "text-xs font-inter mt-1",
}

function SelectorCargo({ cargos, idCargo, onChange, error }) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [posicion, setPosicion] = useState(null)
  const wrapperRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  const cargoSeleccionado = cargos.find((c) => String(c.id_cargo) === String(idCargo))

  const cargosFiltrados = cargos
    .filter((c) => c.activo)
    .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const calcularPosicion = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const espacioAbajo = window.innerHeight - rect.bottom
    const abreArriba = espacioAbajo < 280
    setPosicion({
      left: rect.left,
      width: rect.width,
      top: abreArriba ? undefined : rect.bottom + 4,
      bottom: abreArriba ? window.innerHeight - rect.top + 4 : undefined,
    })
  }

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setAbierto(false)
        setBusqueda('')
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  useEffect(() => {
    if (!abierto) return
    const handleReposicionar = () => calcularPosicion()
    window.addEventListener('scroll', handleReposicionar, true)
    window.addEventListener('resize', handleReposicionar)
    return () => {
      window.removeEventListener('scroll', handleReposicionar, true)
      window.removeEventListener('resize', handleReposicionar)
    }
  }, [abierto])

  const handleToggle = () => {
    const nuevoEstado = !abierto
    if (nuevoEstado) {
      calcularPosicion()
      setBusqueda('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    setAbierto(nuevoEstado)
  }

  const handleSeleccionar = (cargo) => {
    onChange(cargo.id_cargo)
    setAbierto(false)
    setBusqueda('')
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <p className={styles.label} style={{ color: COLORS.labels }}>Cargo</p>

      <button
        ref={triggerRef}
        type="button"
        className={styles.dropdownBtn}
        style={{
          borderColor: error ? '#f87171' : COLORS.dataFields,
          backgroundColor: COLORS.background,
          color: cargoSeleccionado ? COLORS.text : COLORS.labels,
        }}
        onClick={handleToggle}
      >
        <span className="truncate">{cargoSeleccionado ? cargoSeleccionado.nombre : 'Seleccionar cargo'}</span>
        {abierto
          ? <ChevronUp size={16} style={{ color: COLORS.labels, flexShrink: 0 }} />
          : <ChevronDown size={16} style={{ color: COLORS.labels, flexShrink: 0 }} />
        }
      </button>

      {error && (
        <p className={styles.errorCampo} style={{ color: '#ef4444' }}>{error}</p>
      )}

      {abierto && posicion && createPortal(
        <div
          ref={menuRef}
          className={styles.dropdownMenu}
          style={{
            borderColor: COLORS.dataFields,
            backgroundColor: COLORS.background,
            left: posicion.left,
            width: posicion.width,
            top: posicion.top,
            bottom: posicion.bottom,
          }}
        >
          <div className={styles.buscadorWrapper} style={{ borderColor: COLORS.dataFields }}>
            <Search size={14} style={{ color: COLORS.labels, flexShrink: 0 }} />
            <input
              ref={inputRef}
              className={styles.buscadorInput}
              style={{ color: COLORS.text }}
              type="text"
              placeholder="Buscar cargo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className={styles.lista}>
            {cargosFiltrados.length === 0 ? (
              <p className={styles.vacio} style={{ color: COLORS.labels }}>Sin resultados</p>
            ) : (
              cargosFiltrados.map((c) => {
                const sel = String(idCargo) === String(c.id_cargo)
                return (
                  <div
                    key={c.id_cargo}
                    className={styles.dropdownItem}
                    style={{
                      backgroundColor: sel ? COLORS.backgroundHeader : 'transparent',
                      color: sel ? COLORS.primary : COLORS.text,
                      borderTop: `1px solid ${COLORS.dataFields}`,
                    }}
                    onClick={() => handleSeleccionar(c)}
                  >
                    <span>{c.nombre}</span>
                    {sel && <Check size={14} style={{ color: COLORS.primary }} />}
                  </div>
                )
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default SelectorCargo;