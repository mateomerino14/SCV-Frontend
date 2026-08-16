import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  wrapper: "flex flex-col gap-2 mb-4",
  row: "flex gap-2 flex-wrap",
  selectorContainer: "flex flex-col gap-1 relative flex-1 min-w-[180px]",
  trigger: "w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer",
  triggerTexto: "text-sm font-bold font-inter",
  dropdown: "absolute z-50 w-full rounded-xl border shadow-lg overflow-hidden",
  lista: "max-h-56 overflow-y-auto",
  opcion: "px-4 py-2.5 text-sm font-inter cursor-pointer",
}

const categorias = [
  { valor: 'TODOS', label: 'Todos', estados: null },
  { valor: 'BORRADOR', label: 'Sin Enviar', estados: null },
  {
    valor: 'PREVIO',
    label: 'Aprobación de Viaje',
    estados: [
      { valor: 'PREVIO', label: 'Todos los de esta categoría' },
      { valor: 'EN_REVISION_VIAJE', label: 'En Revisión' },
      { valor: 'APROBADO_VIAJE', label: 'Apr. Supervisor' },
      { valor: 'EN_REVISION_TESORERO', label: 'Esperando Fondos' },
      { valor: 'RECHAZADO_PREVIO', label: 'Rechazado' },
    ],
  },
  {
    valor: 'GASTOS',
    label: 'Rendición de Gastos',
    estados: [
      { valor: 'GASTOS', label: 'Todos los de esta categoría' },
      { valor: 'EN_CURSO', label: 'En Curso' },
      { valor: 'EN_REVISION', label: 'En Revisión' },
      { valor: 'APROBADO_SUPERVISOR', label: 'Apr. Supervisor' },
      { valor: 'APROBADO_FINAL', label: 'Aprobado' },
      { valor: 'RECHAZADO_GASTOS', label: 'Rechazado' },
    ],
  },
]

const encontrarCategoriaPorValor = (valor) => {
  for (const cat of categorias) {
    if (cat.valor === valor) return cat
    if (cat.estados?.some((e) => e.valor === valor)) return cat
  }
  return categorias[0]
}

function DropdownSelector({ opciones, valorSeleccionado, onSeleccionar }) {
  const [abierto, setAbierto] = useState(false)
  const [abreArriba, setAbreArriba] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)

  const opcionSeleccionada = opciones.find((o) => o.valor === valorSeleccionado)

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
      setAbreArriba(espacioAbajo < 260)
    }
    setAbierto(!abierto)
  }

  const handleSeleccionar = (opcion) => {
    onSeleccionar(opcion.valor)
    setAbierto(false)
  }

  return (
    <div className={styles.selectorContainer} ref={ref}>
      <div
        ref={triggerRef}
        className={styles.trigger}
        style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}
        onClick={handleToggle}
      >
        <span className={styles.triggerTexto} style={{ color: COLORS.text }}>
          {opcionSeleccionada ? opcionSeleccionada.label : 'Seleccionar'}
        </span>
        {abierto
          ? <ChevronUp size={16} style={{ color: COLORS.labels }} />
          : <ChevronDown size={16} style={{ color: COLORS.labels }} />
        }
      </div>
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
            {opciones.map((o) => (
              <div
                key={o.valor}
                className={styles.opcion}
                style={{
                  color: valorSeleccionado === o.valor ? COLORS.background : COLORS.text,
                  backgroundColor: valorSeleccionado === o.valor ? COLORS.primary : 'transparent',
                  fontWeight: valorSeleccionado === o.valor ? 'bold' : 'normal',
                }}
                onClick={() => handleSeleccionar(o)}
                onMouseEnter={(e) => {
                  if (valorSeleccionado !== o.valor) e.currentTarget.style.backgroundColor = COLORS.backgroundHeader
                }}
                onMouseLeave={(e) => {
                  if (valorSeleccionado !== o.valor) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {o.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FiltroTabs({ filtroActivo, onChange }) {
  const categoriaInicial = encontrarCategoriaPorValor(filtroActivo)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaInicial.valor)

  useEffect(() => {
    const cat = encontrarCategoriaPorValor(filtroActivo)
    setCategoriaSeleccionada(cat.valor)
  }, [filtroActivo])

  const categoriaActual = categorias.find((c) => c.valor === categoriaSeleccionada) || categorias[0]

  const handleCategoriaChange = (valor) => {
    setCategoriaSeleccionada(valor)
    const cat = categorias.find((c) => c.valor === valor)
    if (!cat?.estados) {
      onChange(valor)
    } else {
      onChange(cat.estados[0].valor)
    }
  }

  const handleEstadoChange = (valor) => {
    onChange(valor)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <DropdownSelector
          opciones={categorias.map((c) => ({ valor: c.valor, label: c.label }))}
          valorSeleccionado={categoriaSeleccionada}
          onSeleccionar={handleCategoriaChange}
        />

        {categoriaActual.estados && (
          <DropdownSelector
            opciones={categoriaActual.estados}
            valorSeleccionado={filtroActivo}
            onSeleccionar={handleEstadoChange}
          />
        )}
      </div>
    </div>
  )
}

export default FiltroTabs;