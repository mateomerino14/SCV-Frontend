import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  container: "rounded-xl border mb-2 overflow-hidden",
  header: "flex items-center justify-between p-3 cursor-pointer",
  left: "flex items-center gap-3",
  nombre: "text-sm font-bold font-inter",
  estado: "text-xs font-inter",
  errorGuardado: "text-xs font-inter font-bold mt-1",
  preview: "w-12 h-12 rounded-lg object-cover border",
  expandido: "px-3 pb-3",
}

function FacturaPreviewItem({ factura, index, seleccionado, expandido, onSeleccionar, onEliminar, children }) {
  const handleToggle = () => {
    onSeleccionar(index)
  }

  const monto = parseFloat(factura.datos?.monto || 0)
  const iva = parseFloat(factura.datos?.iva || 0)
  const montoTotal = (monto + iva).toFixed(2)

  const nombreMostrado = factura.datos
    ? `${factura.datos.proveedor} — ${montoTotal} Bs`
    : factura.nombre

  const obtenerColorEstado = () => {
    if (factura.guardado) return '#008330'
    if (factura.errorGuardado) return COLORS.secondary
    if (factura.loading) return COLORS.labels
    if (factura.error) return COLORS.secondary
    return COLORS.primary
  }

  const obtenerTextoEstado = () => {
    if (factura.guardado) return 'Guardado correctamente'
    if (factura.errorGuardado) return 'Error al guardar'
    if (factura.loading) return 'Procesando...'
    if (factura.error) return 'Error al leer'
    return 'Listo'
  }

  const obtenerColorBorde = () => {
    if (factura.guardado) return '#008330'
    if (factura.errorGuardado) return COLORS.secondary
    if (expandido) return COLORS.primary
    return COLORS.dataFields
  }

  return (
    <div
      className={styles.container}
      style={{
        borderColor: obtenerColorBorde(),
        backgroundColor: expandido ? COLORS.backgroundHeader : 'transparent',
      }}
    >
      <div className={styles.header} onClick={handleToggle}>
        <div className={styles.left}>
          <img src={factura.preview} alt="factura" className={styles.preview} />
          <div>
            <p className={styles.nombre} style={{ color: COLORS.text }}>
              {nombreMostrado}
            </p>
            <p className={styles.estado} style={{ color: obtenerColorEstado() }}>
              {obtenerTextoEstado()}
            </p>
            {factura.errorGuardado && (
              <p className={styles.errorGuardado} style={{ color: COLORS.secondary }}>
                {factura.errorGuardado}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {expandido
            ? <ChevronUp size={18} style={{ color: COLORS.labels }} />
            : <ChevronDown size={18} style={{ color: COLORS.labels }} />
          }
          <Trash2
            size={18}
            style={{ color: COLORS.secondary, cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation()
              onEliminar(index)
            }}
          />
        </div>
      </div>

      {expandido && children && (
        <div className={styles.expandido} style={{ backgroundColor: COLORS.background }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default FacturaPreviewItem;