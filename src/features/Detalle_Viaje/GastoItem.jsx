import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants'
import { Trash2, Pencil, Globe, MapPin, Calendar, Tag, FileText, ArrowRight, MessageSquare, List, Receipt } from 'lucide-react'
import ObservacionesGastoModal from '../Revisiones/ObservacionesGastoModal'
import ReciboEnviadoModal from './ReciboEnviadoModal'
import { enviarReciboIndividual } from '../../services/dashboardService'

const obtenerLabelDocumento = (proveedor) => {
  if (!proveedor?.numero_doc_fiscal) return null
  if (proveedor.tipo_doc_fiscal === 'NIT') return `NIT: ${proveedor.numero_doc_fiscal}`
  if (proveedor.tipo_doc_fiscal === 'CI') return `CI: ${proveedor.numero_doc_fiscal}`
  return `Doc: ${proveedor.numero_doc_fiscal}`
}

const tipoLabels = { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }

const formatFecha = (f) => {
  if (!f) return ''
  const str = f.split('T')[0]
  const [y, m, d] = str.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function GastoItem({ gasto, viajeEnCurso, onEliminar, idViaje, origenViaje, observaciones = [] }) {
  const navigate = useNavigate()
  const [showObservaciones, setShowObservaciones] = useState(false)
  const [enviandoRecibo, setEnviandoRecibo] = useState(false)
  const [modalRecibo, setModalRecibo] = useState({ show: false, exito: false, mensaje: '' })

  const labelDoc = obtenerLabelDocumento(gasto.Proveedor)
  const nombreMostrado = gasto.Proveedor?.nombre || gasto.Categoria_Gasto?.nombre || 'Sin proveedor'
  const esInternacional = !!gasto.es_gasto_internacional
  const tieneFactura = gasto.tipo === 'F' || gasto.tipo === 'R'
  const puedeGenerarRecibo = gasto.tipo === 'C' || gasto.tipo === 'S'
  const colorAcento = esInternacional ? COLORS.primary : COLORS.title
  const fechaGasto = gasto.Factura?.fecha_emision || gasto.fecha_gasto
  const subitems = gasto.Gasto_Subitem || []
  const tieneSubitems = subitems.length > 0

  const observacionesDeEsteGasto = observaciones.filter((o) => o.id_gasto === gasto.id_gasto)

  const handleEditar = () => {
    if (esInternacional) {
      navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}/editar-gasto?internacional=true`)
      return
    }
    if (tieneFactura) {
      navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}/editar-factura`)
    } else {
      navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}/editar-gasto`)
    }
  }

  const handleVerDetalle = () => {
    const fromViaje = idViaje ? `/dashboard/empleado/viaje/${idViaje}` : '/dashboard/empleado'
    navigate(`/dashboard/empleado/gasto/${gasto.id_gasto}`, {
      state: { from: fromViaje, origenViaje: origenViaje || '/dashboard/empleado' }
    })
  }

  const handleEnviarRecibo = async () => {
    setEnviandoRecibo(true)
    const data = await enviarReciboIndividual(gasto.id_gasto)
    setEnviandoRecibo(false)
    if (data.error) {
      setModalRecibo({ show: true, exito: false, mensaje: data.error })
      return
    }
    setModalRecibo({ show: true, exito: true, mensaje: 'El recibo fue enviado correctamente a tu correo.' })
  }

  return (
    <div
      style={{
        backgroundColor: COLORS.background,
        border: `1px solid ${COLORS.dataFields}`,
        borderLeft: `3px solid ${colorAcento}`,
        borderRadius: 12,
        marginBottom: 8,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{ color: COLORS.text, fontWeight: 700, fontSize: 13, fontFamily: 'Inter', flex: 1, marginRight: 8, lineHeight: 1.3 }}>
          {nombreMostrado}
        </p>
        <p style={{ color: colorAcento, fontWeight: 700, fontSize: 14, fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
          {parseFloat(gasto.monto_total).toFixed(2)} {esInternacional ? 'USD' : 'Bs'}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {fechaGasto && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.labels, fontFamily: 'Inter' }}>
            <Calendar size={11} style={{ color: colorAcento }} />
            {formatFecha(fechaGasto)}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.labels, fontFamily: 'Inter' }}>
          <Tag size={11} style={{ color: colorAcento }} />
          {tipoLabels[gasto.tipo] || gasto.tipo}
        </span>
        {gasto.Factura?.numero_factura && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: COLORS.labels, fontFamily: 'Inter' }}>
            <FileText size={11} style={{ color: colorAcento }} />
            N° {gasto.Factura.numero_factura}
          </span>
        )}
        {labelDoc && (
          <span style={{ fontSize: 11, color: COLORS.labels, fontFamily: 'Inter' }}>{labelDoc}</span>
        )}
      </div>

      {esInternacional && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
          backgroundColor: COLORS.primary + '15', color: COLORS.primary,
          padding: '2px 8px', borderRadius: 6, width: 'fit-content',
        }}>
          <Globe size={10} />
          {parseFloat(gasto.monto_total).toFixed(2)} USD
        </span>
      )}

      {tieneSubitems && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
          backgroundColor: COLORS.title + '15', color: COLORS.title,
          padding: '2px 8px', borderRadius: 6, width: 'fit-content',
        }}>
          <List size={10} />
          {subitems.length} subgasto{subitems.length !== 1 ? 's' : ''}
        </span>
      )}

      {!tieneSubitems && gasto.descripcion && (
        <p style={{ fontSize: 11, color: COLORS.labels, fontFamily: 'Inter', lineHeight: 1.4 }}>
          {gasto.descripcion}
        </p>
      )}

      {observacionesDeEsteGasto.length > 0 && (
        <button
          onClick={() => setShowObservaciones(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
            backgroundColor: COLORS.error, color: COLORS.secondary,
            padding: '4px 9px', borderRadius: 8, width: 'fit-content',
            cursor: 'pointer', border: 'none',
          }}
        >
          <MessageSquare size={12} />
          {observacionesDeEsteGasto.length} Observación{observacionesDeEsteGasto.length !== 1 ? 'es' : ''}
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 2 }}>
        {puedeGenerarRecibo && (
          <Receipt
            size={16}
            style={{ color: enviandoRecibo ? COLORS.secondary : COLORS.secondary, cursor: enviandoRecibo ? 'default' : 'pointer' }}
            onClick={enviandoRecibo ? undefined : handleEnviarRecibo}
          />
        )}
        {viajeEnCurso && (
          <>
            <Trash2 size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} onClick={() => onEliminar(gasto.id_gasto)} />
            <Pencil size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} onClick={handleEditar} />
          </>
        )}
        {!viajeEnCurso && (
          <span
            style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Inter', color: colorAcento, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3}}
            onClick={handleVerDetalle}
          >
            Ver Detalle <ArrowRight size={11} />
          </span>
        )}
      </div>

      <ObservacionesGastoModal
        isOpen={showObservaciones}
        onClose={() => setShowObservaciones(false)}
        nombreGasto={nombreMostrado}
        observaciones={observacionesDeEsteGasto}
        puedeEditar={false}
        nuevoTexto=""
        setNuevoTexto={() => {}}
        onAgregar={() => {}}
        onEditar={() => {}}
        onEliminar={() => {}}
        loading={false}
        error={null}
      />

      <ReciboEnviadoModal
        isOpen={modalRecibo.show}
        onClose={() => setModalRecibo({ show: false, exito: false, mensaje: '' })}
        exito={modalRecibo.exito}
        mensaje={modalRecibo.mensaje}
      />
    </div>
  )
}

export default GastoItem;