import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import TipoRegistro from '../features/Registrar_Gasto/TipoRegistro'
import CampoGasto from '../features/Registrar_Gasto/CampoGasto'
import SelectorCategoria from '../features/Registrar_Gasto/SelectorCategoria'
import ComprobanteCarga from '../features/Registrar_Gasto/ComprobanteCarga'
import ExitoModal from '../components/ui/ExitoModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useEditarGasto from '../hooks/useEditarGasto'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  card: "rounded-2xl p-5 shadow-md mb-4 flex flex-col gap-5",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  textarea: "w-full bg-transparent outline-none font-inter text-sm resize-none",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
}

function EditarGastoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    tipo, setTipo,
    fecha, proveedor, monto, descripcion,
    idCategoria, categorias,
    previewImagen, loading, loadingDatos,
    error, erroresCampo, guardado, idViaje,
    handleImagenChange, handleEliminarImagen,
    handleMontoChange, handleProveedorChange,
    handleDescripcionChange, handleFechaChange,
    handleCategoriaChange, handleGuardar,
  } = useEditarGasto(id)

  if (loadingDatos) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Editar Gasto" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Editar Gasto" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>
          Modifica los datos del gasto
        </p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Editar Gasto</h1>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <TipoRegistro tipo={tipo} onChange={setTipo} />

          <CampoGasto label="Fecha del Gasto" error={erroresCampo.fecha}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="date"
              value={fecha}
              onChange={(e) => handleFechaChange(e.target.value)}
            />
          </CampoGasto>

          <CampoGasto label="Proveedor (Opcional)">
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              placeholder="Nombre del proveedor"
              value={proveedor}
              onChange={(e) => handleProveedorChange(e.target.value)}
              maxLength={50}
            />
          </CampoGasto>

          <CampoGasto label="Monto" sufijo="Bs" error={erroresCampo.monto}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={monto}
              onChange={(e) => handleMontoChange(e.target.value)}
            />
          </CampoGasto>

          <CampoGasto label="Descripción" error={erroresCampo.descripcion}>
            <textarea
              className={styles.textarea}
              style={{ color: COLORS.text }}
              placeholder="Detalle el motivo del gasto..."
              rows={3}
              value={descripcion}
              onChange={(e) => handleDescripcionChange(e.target.value)}
              maxLength={100}
            />
          </CampoGasto>

          <SelectorCategoria
            categorias={categorias}
            idCategoria={idCategoria}
            onChange={handleCategoriaChange}
            error={erroresCampo.categoria}
          />

          <ComprobanteCarga
            previewImagen={previewImagen}
            onChange={handleImagenChange}
            onEliminar={handleEliminarImagen}
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
        mensaje="El gasto fue actualizado correctamente."
        onAceptar={() => navigate(`/dashboard/empleado/viaje/${idViaje}`)}
      />
      <Footer />
    </div>
  )
}

export default EditarGastoPage;