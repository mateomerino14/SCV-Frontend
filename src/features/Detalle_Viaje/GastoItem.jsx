import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'
import { Trash2, Pencil } from 'lucide-react'

const styles = {
  container: "flex items-center justify-between p-3 border rounded-xl mb-2",
  left: "flex items-center gap-3",
  iconWrapper: "rounded-xl p-2 border-2",
  info: "flex flex-col",
  concepto: "text-sm font-bold font-inter mb-1",
  nit: "text-xs font-inter",
  monto: "text-sm font-bold font-inter",
  verDetalle: "text-xs font-bold font-inter cursor-pointer mt-1",
}

const obtenerLabelDocumento = (proveedor) => {
  if (!proveedor) return 'Sin Comprobante'
  if (!proveedor.numero_doc_fiscal) return 'Sin Comprobante'
  if (proveedor.tipo_doc_fiscal === 'NIT') return `NIT: ${proveedor.numero_doc_fiscal}`
  if (proveedor.tipo_doc_fiscal === 'CI') return `CI: ${proveedor.numero_doc_fiscal}`
  return `Doc: ${proveedor.numero_doc_fiscal}`
}

function GastoItem({ gasto, viajeEnCurso, onEliminar, idViaje, origenViaje }) {
  const navigate = useNavigate()
  const labelDoc = obtenerLabelDocumento(gasto.Proveedor)
  const nombreMostrado = gasto.Proveedor?.nombre || gasto.Categoria_Gasto?.nombre || 'Sin proveedor'

  const handleEditar = () => {
    const esFactura = gasto.tipo === 'F' || gasto.tipo === 'R'
    if (esFactura) {
      navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}/editar-factura`)
    } else {
      navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}/editar-gasto`)
    }
  }

  const handleVerDetalle = () => {
    const fromViaje = idViaje ? `/dashboard/empleado/viaje/${idViaje}` : '/dashboard/empleado'
    navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}`, {
      state: {
        from: fromViaje,
        origenViaje: origenViaje || '/dashboard/empleado',
      }
    })
  }

  return (
    <div className={styles.container} style={{ backgroundColor: COLORS.element }}>
      <div className={styles.left}>
        <div className={styles.iconWrapper} style={{ borderColor: COLORS.backgroundSecondary }}>
          <img
            src="https://img.freepik.com/vector-premium/iconos-gastos_933463-6718.jpg"
            alt="gasto"
            className="h-10 w-10 rounded-lg object-cover"
          />
        </div>
        <div className={styles.info}>
          <p className={styles.concepto} style={{ color: COLORS.text }}>{nombreMostrado}</p>
          <p className={styles.nit} style={{ color: COLORS.text_enviroment_types }}>{labelDoc}</p>
          {!viajeEnCurso && (
            <p className={styles.verDetalle} style={{ color: COLORS.title }} onClick={handleVerDetalle}>
              Ver Detalle
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <p className={styles.monto} style={{ color: COLORS.title }}>
          {parseFloat(gasto.monto_total).toFixed(2)} Bs
        </p>
        {viajeEnCurso && (
          <div className="flex flex-row gap-2">
            <Trash2 size={18} style={{ color: COLORS.secondary, cursor: 'pointer' }} onClick={() => onEliminar(gasto.id_gasto)} />
            <Pencil size={18} style={{ color: COLORS.secondary, cursor: 'pointer' }} onClick={handleEditar} />
          </div>
        )}
      </div>
    </div>
  )
}

export default GastoItem;