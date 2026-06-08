import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import DropZone from '../features/Subir_Factura/DropZone'
import FacturaPreviewItem from '../features/Subir_Factura/FacturaPreviewItem'
import FormularioFactura from '../features/Subir_Factura/FormularioFactura'
import ConsejoLectura from '../features/Subir_Factura/ConsejoLectura'
import SeccionImagen from '../features/Subir_Factura/SeccionImagen'
import DetalleFacturaPanel from '../features/Subir_Factura/DetalleFacturaPanel'
import EliminarFacturaModal from '../features/Subir_Factura/EliminarFacturaModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useSubirFactura from '../hooks/useSubirFactura'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

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
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  resumenCard: "rounded-2xl p-4 mt-3 text-center",
  resumenTexto: "text-sm font-bold font-inter",
  resumenSubtexto: "text-xs font-inter mt-1",
}

function SubirFacturaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    facturas, facturaActual, indexActual, expandidoIndex,
    loadingGuardar, error, resumenGuardado, showEliminarModal,
    hayFacturasConError, todasGuardadas,
    handleAgregarArchivos, handleSeleccionarFactura,
    handlePedirEliminarFactura, handleConfirmarEliminarFactura,
    handleCancelarEliminarFactura, handleCambioDato,
    handleAgregarDetalle, handleEliminarDetalle, handleGuardar,
  } = useSubirFactura(id)

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

        <DropZone onArchivos={handleAgregarArchivos} />

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
                      <SeccionImagen factura={factura} />
                      <div>
                        <FormularioFactura
                          datos={factura.datos}
                          onChange={handleCambioDato}
                          modificadoManualmente={factura.modificadoManualmente}
                          erroresCampo={factura.erroresCampo || {}}
                          guardado={factura.guardado}
                        />
                      </div>
                      <div>
                        <DetalleFacturaPanel
                          detalle={factura.datos.detalle || []}
                          onAgregar={handleAgregarDetalle}
                          onEliminar={handleEliminarDetalle}
                          guardado={factura.guardado}
                        />
                      </div>
                    </div>

                    <div className="md:hidden mt-3 flex flex-col gap-4">
                      <SeccionImagen factura={factura} />
                      <FormularioFactura
                        datos={factura.datos}
                        onChange={handleCambioDato}
                        modificadoManualmente={factura.modificadoManualmente}
                        erroresCampo={factura.erroresCampo || {}}
                        guardado={factura.guardado}
                      />
                      <DetalleFacturaPanel
                        detalle={factura.datos.detalle || []}
                        onAgregar={handleAgregarDetalle}
                        onEliminar={handleEliminarDetalle}
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

      <Footer />
    </div>
  )
}

export default SubirFacturaPage;