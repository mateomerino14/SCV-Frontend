import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Calendar, DollarSign, Tag, FileText, User, Receipt, PenLine, Globe, List } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import ReciboEnviadoModal from '../features/Detalle_Viaje/ReciboEnviadoModal'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import { obtenerDetalleGasto, enviarReciboIndividual } from '../services/dashboardService'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-6 w-fit",
  headerCard: "rounded-2xl p-6 mb-4 shadow-md",
  headerTop: "flex items-start justify-between mb-4",
  titulo: "text-xl font-bold font-inter leading-tight flex-1 mr-3",
  badge: "text-xs font-bold font-inter px-3 py-1.5 rounded-full uppercase shrink-0",
  montoGrande: "text-4xl font-bold font-inter",
  montoLabel: "text-xs font-inter uppercase mt-1",
  modificadoBadge: "inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase",
  internacionalBadge: "inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase",
  seccionCard: "rounded-2xl p-5 mb-4 shadow-md border",
  seccionTitulo: "text-xs font-bold font-inter uppercase mb-4 flex items-center gap-2",
  filaInfo: "flex items-start gap-3 py-3 border-b",
  filaInfoLast: "flex items-start gap-3 py-3",
  iconoCampo: "rounded-lg p-2 mt-0.5 shrink-0",
  campoLabel: "text-xs font-inter uppercase mb-0.5",
  campoValor: "text-sm font-bold font-inter",
  tablaWrapper: "border rounded-xl overflow-hidden mt-2",
  tablaHeader: "grid gap-1 font-bold uppercase py-2.5 text-xs font-nunito text-center",
  tablaFila: "grid gap-1 py-2.5 items-center text-sm font-inter text-center border-b",
  tablaTotal: "flex justify-between items-center px-3 py-3",
  imagenWrapper: "rounded-xl overflow-hidden border mt-2",
  imagen: "w-full object-contain",
  retencionFila: "flex justify-between items-center py-2 border-b",
  retencionFilaLast: "flex justify-between items-center py-2",
  retencionLabel: "text-xs font-inter",
  retencionValor: "text-xs font-bold font-inter",
  retencionTotal: "flex justify-between items-center pt-3 mt-1 border-t",
  retencionTotalLabel: "text-sm font-bold font-inter",
  retencionTotalValor: "text-sm font-bold font-inter",
  tramosTitulo: "text-xs font-bold font-inter uppercase mb-2 mt-4",
  tramoTablaHeader: "grid gap-1 font-bold uppercase py-2.5 text-xs font-nunito text-center",
  tramoTablaFila: "grid gap-1 py-2.5 items-center text-sm font-inter text-center border-b",
  tramoTablaTotal: "flex justify-between items-center px-3 py-3",
  subitemTablaHeader: "grid gap-1 font-bold uppercase py-2.5 text-xs font-nunito text-center",
  subitemTablaFila: "grid gap-1 py-2.5 items-center text-sm font-inter text-center border-b",
  subitemTablaTotal: "flex justify-between items-center px-3 py-3",
  reciboBtn: "inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase cursor-pointer border-none",
}

const gridColumnas = { gridTemplateColumns: '2fr 1fr 1fr' }
const gridColumnasTramos = { gridTemplateColumns: '1fr 1fr 1fr' }
const gridColumnasSubitems = { gridTemplateColumns: '2fr 1fr' }

const tipoConfig = {
  F: { label: 'Factura', bg: COLORS.cargo_rol, color: '#3b4fd4' },
  R: { label: 'Recibo', bg: COLORS.travel_types, color: COLORS.text_types_text },
  C: { label: 'Compra', bg: '#e6f4ea', color: '#2d7a3a' },
  S: { label: 'Servicio', bg: COLORS.backgroundHeader, color: COLORS.labels },
}

const tipoRetencionLabel = {
  C: 'Compra sin Factura',
  S: 'Servicio sin Factura',
}

const formatFechaLarga = (f) => {
  const [y, m, d] = f.split('T')[0].split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function CampoInfo({ icono: Icono, label, valor, ultimo }) {
  return (
    <div className={ultimo ? styles.filaInfoLast : styles.filaInfo}>
      <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
        <Icono size={16} style={{ color: COLORS.title }} />
      </div>
      <div>
        <p className={styles.campoLabel} style={{ color: COLORS.labels }}>{label}</p>
        <p className={styles.campoValor} style={{ color: COLORS.text }}>{valor}</p>
      </div>
    </div>
  )
}

function DetalleGastoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origen = location.state?.from || '/dashboard/empleado'
  const origenViaje = location.state?.origenViaje || '/dashboard/empleado'
  const [gasto, setGasto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviandoRecibo, setEnviandoRecibo] = useState(false)
  const [modalRecibo, setModalRecibo] = useState({ show: false, exito: false, mensaje: '' })
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const data = await obtenerDetalleGasto(id)
      setLoading(false)
      if (!data.error) setGasto(data)
    }
    cargar()
  }, [id])

  const handleEnviarRecibo = async () => {
    setEnviandoRecibo(true)
    const data = await enviarReciboIndividual(id)
    setEnviandoRecibo(false)
    if (data.error) {
      setModalRecibo({ show: true, exito: false, mensaje: data.error })
      return
    }
    setModalRecibo({ show: true, exito: true, mensaje: 'El recibo fue enviado correctamente a tu correo.' })
  }

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalle de Gasto" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!gasto) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalle de Gasto" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.secondary }}>No se encontró el gasto</p>
        </div>
        <Footer />
      </div>
    )
  }

  const tipoInfo = tipoConfig[gasto.tipo] || tipoConfig['S']
  const tieneFactura = !!gasto.Factura
  const tieneImagen = gasto.Imagen && gasto.Imagen.url_archivo
  const esInternacional = !!gasto.es_gasto_internacional
  const moneda = esInternacional ? 'USD' : 'Bs'
  const tramos = gasto.Gasto_Tramo_Moneda || []
  const tieneTramos = esInternacional && tramos.length > 0
  const subitems = gasto.Gasto_Subitem || []
  const tieneSubitems = subitems.length > 0
  const puedeGenerarRecibo = gasto.tipo === 'C' || gasto.tipo === 'S'

  const tieneRetenciones = !esInternacional && (gasto.tipo === 'C' || gasto.tipo === 'S') &&
    (parseFloat(gasto.retencion_rc_iva || 0) > 0 || parseFloat(gasto.retencion_iue || 0) > 0 || parseFloat(gasto.retencion_it || 0) > 0)

  const calcularIva = () => {
    if (!tieneFactura) return null
    const monto = parseFloat(gasto.Factura.monto_parcial || 0)
    const total = parseFloat(gasto.monto_total || 0)
    const iva = total - monto
    if (iva <= 0) return null
    return iva
  }

  const iva = calcularIva()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalle de Gasto" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(origen, { state: { from: origenViaje } })}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <div className={styles.headerCard} style={{ backgroundColor: COLORS.primary }}>
          <div className={styles.headerTop}>
            <p className={styles.titulo} style={{ color: COLORS.background }}>{gasto.descripcion || (tieneSubitems ? 'Gasto con varios subgastos' : '')}</p>
            <span className={styles.badge} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: COLORS.background }}>
              {tipoInfo.label}
            </span>
          </div>
          <p className={styles.montoGrande} style={{ color: COLORS.background }}>
            {parseFloat(gasto.monto_total).toFixed(2)} {moneda}
          </p>
          <p className={styles.montoLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>
            {esInternacional ? 'Monto Total en USD' : 'Monto Total del Gasto'}
          </p>
          {(esInternacional || tieneTramos || tieneSubitems) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {esInternacional && (
                <span className={styles.internacionalBadge} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', marginTop: 0 }}>
                  <Globe size={12} />
                  Gasto Internacional
                </span>
              )}
              {tieneTramos && (
                <span className={styles.internacionalBadge} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', marginTop: 0 }}>
                  <Globe size={12} />
                  {tramos.length} tramo{tramos.length !== 1 ? 's' : ''} de cambio
                </span>
              )}
              {tieneSubitems && (
                <span className={styles.internacionalBadge} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', marginTop: 0 }}>
                  <List size={12} />
                  {subitems.length} subgasto{subitems.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
          {gasto.modificado && (
            <span className={styles.modificadoBadge} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
              <PenLine size={12} />
              Modificado manualmente
            </span>
          )}
          {puedeGenerarRecibo && (
            <button
              className={styles.reciboBtn}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: COLORS.primary, opacity: enviandoRecibo ? 0.6 : 1 }}
              onClick={handleEnviarRecibo}
              disabled={enviandoRecibo}
            >
              <Receipt size={12} />
              {enviandoRecibo ? 'Enviando recibo...' : 'Enviar Recibo por Correo'}
            </button>
          )}
        </div>

        <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
          <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
            <Calendar size={14} />
            Información General
          </p>
          <CampoInfo icono={Calendar} label="Fecha del Gasto" valor={formatFechaLarga(gasto.fecha_gasto)} />
          {gasto.Categoria_Gasto && <CampoInfo icono={Tag} label="Categoría" valor={gasto.Categoria_Gasto.nombre} />}
          {gasto.Proveedor && <CampoInfo icono={User} label="Proveedor" valor={gasto.Proveedor.nombre} />}
          {gasto.Proveedor?.numero_doc_fiscal && (
            <CampoInfo icono={FileText} label={gasto.Proveedor.tipo_doc_fiscal || 'Documento'} valor={gasto.Proveedor.numero_doc_fiscal} ultimo={!tieneFactura} />
          )}
          {!gasto.Proveedor?.numero_doc_fiscal && (
            <div className={styles.filaInfoLast}>
              <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.error }}>
                <FileText size={16} style={{ color: COLORS.secondary }} />
              </div>
              <div>
                <p className={styles.campoLabel} style={{ color: COLORS.labels }}>Comprobante</p>
                <p className={styles.campoValor} style={{ color: COLORS.secondary }}>Sin Comprobante</p>
              </div>
            </div>
          )}
        </div>

        {tieneSubitems && (
          <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
              <List size={14} />
              Detalle de Subgastos
            </p>
            <div className={styles.tablaWrapper} style={{ borderColor: COLORS.dataFields }}>
              <div className={styles.subitemTablaHeader} style={{ color: COLORS.background, backgroundColor: COLORS.title, ...gridColumnasSubitems }}>
                <span>Descripción</span>
                <span>Monto</span>
              </div>
              {subitems.map((si, i) => (
                <div key={si.id_subitem || i} className={styles.subitemTablaFila} style={{ borderColor: COLORS.dataFields, backgroundColor: i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader, ...gridColumnasSubitems }}>
                  <span className="px-2 text-left" style={{ color: COLORS.text }}>{si.descripcion}</span>
                  <span style={{ color: COLORS.title, fontWeight: 'bold' }}>{parseFloat(si.monto).toFixed(2)} {moneda}</span>
                </div>
              ))}
              <div className={styles.subitemTablaTotal} style={{ backgroundColor: COLORS.title }}>
                <span className="text-xs font-bold font-inter uppercase" style={{ color: COLORS.background }}>Total</span>
                <span className="text-sm font-bold font-inter" style={{ color: COLORS.background }}>
                  {subitems.reduce((s, si) => s + parseFloat(si.monto || 0), 0).toFixed(2)} {moneda}
                </span>
              </div>
            </div>
          </div>
        )}

        {tieneTramos && (
          <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
              <Globe size={14} />
              Tramos de Cambio de Moneda
            </p>
            <div className={styles.tablaWrapper} style={{ borderColor: COLORS.dataFields }}>
              <div className={styles.tramoTablaHeader} style={{ color: COLORS.background, backgroundColor: COLORS.primary, ...gridColumnasTramos }}>
                <span>Monto Origen</span>
                <span>Tipo de Cambio</span>
                <span>Equivalente USD</span>
              </div>
              {tramos.map((t, i) => (
                <div key={t.id_tramo || i} className={styles.tramoTablaFila} style={{ borderColor: COLORS.dataFields, backgroundColor: i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader, ...gridColumnasTramos }}>
                  <span style={{ color: COLORS.text }}>{parseFloat(t.monto_origen).toFixed(2)} {t.moneda}</span>
                  <span style={{ color: COLORS.labels }}>1 USD = {parseFloat(t.tipo_cambio).toFixed(4)} {t.moneda}</span>
                  <span style={{ color: COLORS.primary, fontWeight: 'bold' }}>{parseFloat(t.monto_usd).toFixed(2)} USD</span>
                </div>
              ))}
              <div className={styles.tramoTablaTotal} style={{ backgroundColor: COLORS.primary }}>
                <span className="text-xs font-bold font-inter uppercase" style={{ color: COLORS.background }}>Total</span>
                <span className="text-sm font-bold font-inter" style={{ color: COLORS.background }}>
                  {tramos.reduce((s, t) => s + parseFloat(t.monto_usd || 0), 0).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        )}

        {tieneFactura && (
          <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
              <Receipt size={14} />
              Datos de la Factura
            </p>
            <CampoInfo icono={FileText} label="Número de Factura" valor={gasto.Factura.numero_factura} />
            <CampoInfo icono={Calendar} label="Fecha de Emisión" valor={formatFechaLarga(gasto.Factura.fecha_emision)} />
            <CampoInfo icono={DollarSign} label="Monto sin impuestos" valor={`${parseFloat(gasto.Factura.monto_parcial).toFixed(2)} ${moneda}`} ultimo={!iva && !(gasto.Factura.Detalle_Factura?.length > 0)} />
            {iva && <CampoInfo icono={DollarSign} label="IVA" valor={`${iva.toFixed(2)} ${moneda}`} ultimo={!(gasto.Factura.Detalle_Factura?.length > 0)} />}
            {gasto.Factura.Detalle_Factura && gasto.Factura.Detalle_Factura.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold font-inter uppercase mb-2" style={{ color: COLORS.labels }}>Detalle de Productos</p>
                <div className={styles.tablaWrapper} style={{ borderColor: COLORS.dataFields }}>
                  <div className={styles.tablaHeader} style={{ color: COLORS.background, backgroundColor: COLORS.title, paddingRight: '17px', ...gridColumnas }}>
                    <span>Descripción</span>
                    <span>Cant.</span>
                    <span>Precio</span>
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'scroll', scrollbarGutter: 'stable' }}>
                    {gasto.Factura.Detalle_Factura.map((d, i) => (
                      <div key={i} className={styles.tablaFila} style={{ borderColor: COLORS.dataFields, backgroundColor: i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader, ...gridColumnas }}>
                        <span className="px-2 text-left" style={{ color: COLORS.text }}>{d.nombre_producto}</span>
                        <span style={{ color: COLORS.text }}>{d.cantidad}</span>
                        <span style={{ color: COLORS.title, fontWeight: 'bold' }}>{parseFloat(d.precio).toFixed(2)} {moneda}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.tablaTotal} style={{ backgroundColor: COLORS.title }}>
                    <span className="text-xs font-bold font-inter uppercase" style={{ color: COLORS.background }}>Total</span>
                    <span className="text-sm font-bold font-inter" style={{ color: COLORS.background }}>{parseFloat(gasto.monto_total).toFixed(2)} {moneda}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tieneRetenciones && (
          <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
              <DollarSign size={14} />
              Retenciones — {tipoRetencionLabel[gasto.tipo]}
            </p>
            <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
              <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>Monto pagado</p>
              <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {parseFloat(gasto.monto_total).toFixed(2)}</p>
            </div>
            <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
              <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>Base imponible</p>
              <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {parseFloat(gasto.base_imponible || 0).toFixed(2)}</p>
            </div>
            {gasto.tipo === 'S' && parseFloat(gasto.retencion_rc_iva || 0) > 0 && (
              <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>RC-IVA 13%</p>
                <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {parseFloat(gasto.retencion_rc_iva).toFixed(2)}</p>
              </div>
            )}
            {gasto.tipo === 'C' && parseFloat(gasto.retencion_iue || 0) > 0 && (
              <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>IUE 5%</p>
                <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {parseFloat(gasto.retencion_iue).toFixed(2)}</p>
              </div>
            )}
            {parseFloat(gasto.retencion_it || 0) > 0 && (
              <div className={styles.retencionFilaLast}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>IT 3%</p>
                <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {parseFloat(gasto.retencion_it).toFixed(2)}</p>
              </div>
            )}
            <div className={styles.retencionTotal} style={{ borderColor: COLORS.dataFields }}>
              <p className={styles.retencionTotalLabel} style={{ color: COLORS.title }}>Importe Costo</p>
              <p className={styles.retencionTotalValor} style={{ color: COLORS.title }}>Bs {parseFloat(gasto.importe_costo || 0).toFixed(2)}</p>
            </div>
          </div>
        )}

        {tieneImagen && (
          <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background, borderColor: COLORS.labels }}>
            <p className={styles.seccionTitulo} style={{ color: COLORS.labels }}>
              <FileText size={14} />
              Comprobante
            </p>
            <div className={styles.imagenWrapper} style={{ borderColor: COLORS.dataFields }}>
              <img src={gasto.Imagen.url_archivo} alt="comprobante" className={styles.imagen} style={{ maxHeight: '450px', backgroundColor: COLORS.backgroundHeader }} />
            </div>
          </div>
        )}
      </div>

      <ReciboEnviadoModal
        isOpen={modalRecibo.show}
        onClose={() => setModalRecibo({ show: false, exito: false, mensaje: '' })}
        exito={modalRecibo.exito}
        mensaje={modalRecibo.mensaje}
      />

      <Footer />
    </div>
  )
}

export default DetalleGastoPage;