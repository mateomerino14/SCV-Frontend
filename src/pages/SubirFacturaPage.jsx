import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import DropZone from '../features/Subir_Factura/DropZone'
import FacturaPreviewItem from '../features/Subir_Factura/FacturaPreviewItem'
import FormularioFactura from '../features/Subir_Factura/FormularioFactura'
import ConsejoLectura from '../features/Subir_Factura/ConsejoLectura'
import SeccionImagen from '../features/Subir_Factura/SeccionImagen'
import DetalleFacturaPanel from '../features/Subir_Factura/DetalleFacturaPanel'
import EliminarFacturaModal from '../features/Subir_Factura/EliminarFacturaModal'
import SolicitarAutorizacionModal from '../features/Detalle_Viaje/SolicitarAutorizacionModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useSubirFactura from '../hooks/useSubirFactura'
import useSolicitudPlazo from '../hooks/useSolicitudPlazo'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const PLACEHOLDER_FACTURA = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRh2G9ljcdizU4yHbZjI_JCm0GWCGJBcPgt39YIhrpew&s=10"

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-4",
  descripcion: "text-md font-inter mb-4",
  card: "rounded-2xl p-5 shadow-md mb-4",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-3",
  enviarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  solicitudBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-3 flex items-center justify-center gap-2",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  resumenCard: "rounded-2xl p-4 mt-3 text-center",
  resumenTexto: "text-sm font-bold font-inter",
  resumenSubtexto: "text-xs font-inter mt-1",
  imagenManualWrapper: "flex flex-col gap-2 mt-2",
  imagenManualLabel: "text-xs font-bold font-inter uppercase mb-1",
  imagenManualBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border flex items-center justify-center gap-2 mt-2",
  imagenManualError: "text-xs font-inter mt-1",
  alertaPlazo: "rounded-xl px-4 py-3 mb-4 text-center",
}

function SeccionImagenManual({ factura, onImagenChange, errorImagen }) {
  const handleSeleccion = (e) => {
    if (e.target.files[0]) onImagenChange(e.target.files[0])
    e.target.value = ''
  }

  return (
    <div className={styles.imagenManualWrapper}>
      <p className={styles.imagenManualLabel} style={{ color: COLORS.labels }}>
        Comprobante / Imagen <span style={{ color: COLORS.secondary }}>*</span>
      </p>

      <div
        style={{
          borderColor: errorImagen ? '#ef4444' : COLORS.dataFields,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: COLORS.backgroundHeader,
        }}
      >
        <img
          src={factura.preview || PLACEHOLDER_FACTURA}
          alt="comprobante"
          style={{
            width: '100%',
            objectFit: 'cover',
            maxHeight: factura.preview ? '710px' : '200px',
            opacity: factura.preview ? 1 : 0.5,
          }}
        />
      </div>

      <label
        className={styles.imagenManualBtn}
        style={{
          borderColor: errorImagen ? '#ef4444' : COLORS.primary,
          color: errorImagen ? '#ef4444' : COLORS.primary,
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        {factura.preview ? 'Cambiar imagen' : 'Subir comprobante'}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleSeleccion}
        />
      </label>

      {errorImagen && (
        <p className={styles.imagenManualError} style={{ color: '#ef4444' }}>{errorImagen}</p>
      )}
    </div>
  )
}


function SubirFacturaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    facturas, facturaActual, indexActual, expandidoIndex,
    loadingGuardar, error, resumenGuardado, showEliminarModal,
    hayFacturasConError, hayRequiereAutorizacion, todasGuardadas,
    handleAgregarArchivos, handleAgregarManual,
    handleSeleccionarFactura,
    handlePedirEliminarFactura, handleConfirmarEliminarFactura,
    handleCancelarEliminarFactura, handleCambioDato,
    handleAgregarDetalle, handleEliminarDetalle, handleGuardar,
    handleImagenManualChange,
  } = useSubirFactura(id)

  const {
    tienePendiente, fueRechazada, puedeSolicitar,
    showModal: showModalPlazo, setShowModal: setShowModalPlazo,
    enviando: enviandoPlazo, error: errorPlazo,
    handleSolicitar,
  } = useSolicitudPlazo(id)

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Registro de Facturas" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>Proceso de Gastos</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Digitalización de Factura</h1>
        <p className={styles.descripcion} style={{ color: COLORS.text_enviroment_types }}>
          Capture su comprobante de gasto para el procesamiento automático mediante IA.
          Asegúrese de que todos los datos sean legibles.
        </p>

        {tienePendiente && (
          <div className={styles.alertaPlazo} style={{ backgroundColor: '#ffd700aa' }}>
            <p style={{ color: '#7a5900', fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
              Tienes una solicitud de autorización de plazo pendiente de revisión.
            </p>
          </div>
        )}

        {fueRechazada && (
          <div className={styles.alertaPlazo} style={{ backgroundColor: '#ffa7a8aa' }}>
            <p style={{ color: '#500203', fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
              Tu solicitud de autorización de plazo anterior fue rechazada.
            </p>
          </div>
        )}

        <DropZone onArchivos={handleAgregarArchivos} onManual={handleAgregarManual} />

        <div className="mt-4">
          <ConsejoLectura />
        </div>

        {facturas.length > 0 && (
          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <p className={styles.sectionTitle} style={{ color: COLORS.labels }}>Facturas Cargadas</p>

            {facturas.map((factura, indice) => (
              <FacturaPreviewItem
                key={indice}
                factura={factura}
                index={indice}
                seleccionado={indexActual === indice}
                expandido={expandidoIndex === indice}
                onSeleccionar={handleSeleccionarFactura}
                onEliminar={handlePedirEliminarFactura}
              >
                {factura.datos && (
                  <>
                    <div className="hidden md:grid md:grid-cols-3 gap-4 mt-3">
                      {factura.manual ? (
                        <SeccionImagenManual
                          factura={factura}
                          onImagenChange={(file) => handleImagenManualChange(file, indice)}
                          errorImagen={factura.erroresCampo?.imagen}
                        />
                      ) : (
                        <SeccionImagen factura={factura} />
                      )}
                      <div>
                        <FormularioFactura
                        datos={factura.datos}
                        onChange={(campo, valor, silencioso) => handleCambioDato(indice, campo, valor, silencioso)}
                        modificadoManualmente={factura.modificadoManualmente}
                        erroresCampo={factura.erroresCampo || {}}
                        guardado={factura.guardado}
                      />
                      </div>
                      <div>
                        <DetalleFacturaPanel
                        detalle={factura.datos.detalle || []}
                        onAgregar={(item) => handleAgregarDetalle(indice, item)}
                        onEliminar={(idx) => handleEliminarDetalle(indice, idx)}
                        guardado={factura.guardado}
                      />
                      </div>
                    </div>

                    <div className="md:hidden mt-3 flex flex-col gap-4">
                      {factura.manual ? (
                        <SeccionImagenManual
                          factura={factura}
                          onImagenChange={(file) => handleImagenManualChange(file, indice)}
                          errorImagen={factura.erroresCampo?.imagen}
                        />
                      ) : (
                        <SeccionImagen factura={factura} />
                      )}
                      <FormularioFactura
                        datos={factura.datos}
                        onChange={(campo, valor, silencioso) => handleCambioDato(indice, campo, valor, silencioso)}
                        modificadoManualmente={factura.modificadoManualmente}
                        erroresCampo={factura.erroresCampo || {}}
                        guardado={factura.guardado}
                      />
                      <DetalleFacturaPanel
                        detalle={factura.datos.detalle || []}
                        onAgregar={(item) => handleAgregarDetalle(indice, item)}
                        onEliminar={(idx) => handleEliminarDetalle(indice, idx)}
                        guardado={factura.guardado}
                      />
                    </div>
                  </>
                )}
              </FacturaPreviewItem>
            ))}
          </div>
        )}

        {resumenGuardado && (
          <div className={styles.resumenCard} style={{ backgroundColor: resumenGuardado.errores > 0 ? '#fef3cd' : '#d4edda' }}>
            <p className={styles.resumenTexto} style={{ color: resumenGuardado.errores > 0 ? '#856404' : '#155724' }}>
              {resumenGuardado.guardadas} factura{resumenGuardado.guardadas !== 1 ? 's' : ''} guardada{resumenGuardado.guardadas !== 1 ? 's' : ''} correctamente
            </p>
            {resumenGuardado.errores > 0 && (
              <p className={styles.resumenSubtexto} style={{ color: '#856404' }}>
                {resumenGuardado.errores} factura{resumenGuardado.errores !== 1 ? 's' : ''} con error — revisa las marcadas en rojo
              </p>
            )}
          </div>
        )}

        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {hayRequiereAutorizacion && puedeSolicitar && !tienePendiente && (
          <button
            className={styles.solicitudBtn}
            style={{ backgroundColor: COLORS.secondary, color: COLORS.background }}
            onClick={() => setShowModalPlazo(true)}
          >
            <AlertTriangle size={16} />
            Solicitar Autorización al Revisor
          </button>
        )}

        {facturas.some((f) => f.datos && !f.loading && !f.guardado) && (
          <>
            <button
              className={styles.enviarBtn}
              style={{ backgroundColor: loadingGuardar ? COLORS.fields : COLORS.primary }}
              onClick={handleGuardar}
              disabled={loadingGuardar}
            >
              {loadingGuardar ? 'Guardando...' : `Guardar ${facturas.filter((f) => f.datos && !f.loading && !f.guardado).length} factura${facturas.filter((f) => f.datos && !f.loading && !f.guardado).length !== 1 ? 's' : ''}`}
            </button>
            <button
              className={styles.cancelarBtn}
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
              onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}
            >
              Cancelar
            </button>
          </>
        )}

        {todasGuardadas && !hayFacturasConError && (
          <button
            className={styles.enviarBtn}
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}
          >
            Volver al viaje
          </button>
        )}
      </div>

      <EliminarFacturaModal
        isOpen={showEliminarModal}
        onClose={handleCancelarEliminarFactura}
        onConfirm={handleConfirmarEliminarFactura}
      />

      <SolicitarAutorizacionModal
        isOpen={showModalPlazo}
        onClose={() => setShowModalPlazo(false)}
        onConfirm={handleSolicitar}
        loading={enviandoPlazo}
        error={errorPlazo}
      />

      <Footer />
    </div>
  )
}

export default SubirFacturaPage;