import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-1 relative",
  label: "text-xs font-bold font-inter uppercase mb-3",
  trigger: "w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer",
  triggerTexto: "text-sm font-inter",
  dropdown: "absolute z-50 w-full mt-1 rounded-xl border shadow-lg overflow-hidden",
  lista: "max-h-48 overflow-y-auto",
  opcionPlaceholder: "px-4 py-2.5 text-sm font-inter cursor-pointer",
  opcion: "px-4 py-2.5 text-sm font-inter cursor-pointer",
}

function SelectorCategoria({ categorias, idCategoria, onChange }) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  const categoriaSeleccionada = categorias.find((c) => c.id_categoria === idCategoria)

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const handleSeleccionar = (cat) => {
    onChange(cat ? cat.id_categoria : null)
    setAbierto(false)
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <p className={styles.label} style={{ color: COLORS.labels }}>Categoría</p>

      <div
        className={styles.trigger}
        style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
        onClick={() => setAbierto(!abierto)}
      >
        <span
          className={styles.triggerTexto}
          style={{ color: categoriaSeleccionada ? COLORS.text : COLORS.labels }}
        >
          {categoriaSeleccionada ? categoriaSeleccionada.nombre : 'Seleccione una Categoría'}
        </span>
        {abierto
          ? <ChevronUp size={16} style={{ color: COLORS.labels }} />
          : <ChevronDown size={16} style={{ color: COLORS.labels }} />
        }
      </div>

      {abierto && (
        <div
          className={styles.dropdown}
          style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
        >
          <div className={styles.lista}>
            <div
              className={styles.opcionPlaceholder}
              style={{ color: COLORS.labels }}
              onClick={() => handleSeleccionar(null)}
            >
              Seleccione una Categoría
            </div>
            {categorias.map((cat) => (
              <div
                key={cat.id_categoria}
                className={styles.opcion}
                style={{
                  color: idCategoria === cat.id_categoria ? COLORS.background : COLORS.text,
                  backgroundColor: idCategoria === cat.id_categoria ? COLORS.primary : 'transparent',
                  fontWeight: idCategoria === cat.id_categoria ? 'bold' : 'normal',
                }}
                onClick={() => handleSeleccionar(cat)}
                onMouseEnter={(e) => {
                  if (idCategoria !== cat.id_categoria) {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundHeader
                  }
                }}
                onMouseLeave={(e) => {
                  if (idCategoria !== cat.id_categoria) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {cat.nombre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectorCategoria;