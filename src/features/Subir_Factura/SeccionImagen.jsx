import { COLORS } from '../../constants'

const styles = {
  imagenWrapper: "rounded-xl overflow-hidden mt-3 shadow-md max-h-200",
  imagenFooter: "p-3 flex flex-col justify-between items-start",
  imagenMetaLabel: "text-xs font-inter pl-2",
  imagenMetaValor: "text-sm font-bold font-inter pl-2",
}

const calcularMontoTotal = (datos) => {
  const monto = parseFloat(datos.monto || 0)
  const iva = parseFloat(datos.iva || 0)
  return (monto + iva).toFixed(2)
}

function SeccionImagen({ factura }) {
  const nombreFactura = `${factura.datos.proveedor} — ${calcularMontoTotal(factura.datos)} Bs`
  return (
    <div className={styles.imagenWrapper}>
      <img
        src={factura.preview}
        alt="factura"
        className="w-full object-cover"
        style={{ maxHeight: '710px' }}
      />
      <div
        className={styles.imagenFooter}
        style={{ backgroundColor: COLORS.backgroundHeader }}
      >
        <div className='text-left'>
          <p className={styles.imagenMetaLabel} style={{ color: COLORS.labels }}>
            Vista Previa
          </p>
          <p className={styles.imagenMetaValor} style={{ color: COLORS.text }}>
            {nombreFactura}
          </p>
        </div>
        <div className="text-left">
          <p className={styles.imagenMetaLabel} style={{ color: COLORS.labels }}>
            Fecha detectada
          </p>
          <p className={styles.imagenMetaValor} style={{ color: COLORS.text }}>
            {factura.datos.fecha_emision}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SeccionImagen;