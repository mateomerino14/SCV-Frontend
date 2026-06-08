import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import FormularioFactura from '../features/Subir_Factura/FormularioFactura'
import DetalleFacturaPanel from '../features/Subir_Factura/DetalleFacturaPanel'
import SeccionImagen from '../features/Subir_Factura/SeccionImagen'
import ComprobanteCarga from '../features/Registrar_Gasto/ComprobanteCarga'
import ExitoModal from '../components/ui/ExitoModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useEditarFactura from '../hooks/useEditarFactura'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  grid: "hidden md:grid md:grid-cols-3 gap-4 mt-3",
  columna: "hidden md:grid gap-4 mt-3",
  mobile: "md:hidden flex flex-col gap-4",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
}

function EditarFacturaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    datos, previewImagen, loading, loadingDatos,
    error, erroresCampo, guardado, modificadoManualmente, idViaje,
    handleCambioDato, handleAgregarDetalle, handleEliminarDetalle,
    handleImagenChange, handleEliminarImagen, handleGuardar,
  } = useEditarFactura(id)

  if (loadingDatos || !datos) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Editar Factura" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const facturaParaPreview = previewImagen ? { preview: previewImagen, datos } : null

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Editar Factura" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>
          Modifica los datos de la factura
        </p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Editar Factura</h1>

        <div className={styles.grid}>
          <div className={styles.columna}>
            {facturaParaPreview ? (
              <SeccionImagen factura={facturaParaPreview} />
            ) : (
              <ComprobanteCarga
                previewImagen={previewImagen}
                onChange={handleImagenChange}
                onEliminar={handleEliminarImagen}
              />
            )}
          </div>
          <div>
            <FormularioFactura
              datos={datos}
              onChange={handleCambioDato}
              modificadoManualmente={modificadoManualmente}
              erroresCampo={erroresCampo}
            />
          </div>
          <div>
            <DetalleFacturaPanel
              detalle={datos.detalle || []}
              onAgregar={handleAgregarDetalle}
              onEliminar={handleEliminarDetalle}
            />
          </div>
        </div>

        <div className={styles.mobile}>
          {facturaParaPreview ? (
            <SeccionImagen factura={facturaParaPreview} />
          ) : (
            <ComprobanteCarga
              previewImagen={previewImagen}
              onChange={handleImagenChange}
              onEliminar={handleEliminarImagen}
            />
          )}
          <FormularioFactura
            datos={datos}
            onChange={handleCambioDato}
            modificadoManualmente={modificadoManualmente}
            erroresCampo={erroresCampo}
          />
          <DetalleFacturaPanel
            detalle={datos.detalle || []}
            onAgregar={handleAgregarDetalle}
            onEliminar={handleEliminarDetalle}
          />
        </div>

        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        <button
          className={styles.guardarBtn}
          style={{ backgroundColor: loading ? COLORS.fields : COLORS.primary }}
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button
          className={styles.cancelarBtn}
          style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
      </div>

      <ExitoModal
        isOpen={guardado}
        titulo="Cambios Guardados"
        mensaje="La factura fue actualizada correctamente."
        onAceptar={() => navigate(`/dashboard/empleado/viaje/${idViaje}`)}
      />

      <Footer />
    </div>
  )
}

export default EditarFacturaPage;