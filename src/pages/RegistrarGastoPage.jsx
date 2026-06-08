import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import TipoRegistro from '../features/Registrar_Gasto/TipoRegistro'
import CampoGasto from '../features/Registrar_Gasto/CampoGasto'
import SelectorCategoria from '../features/Registrar_Gasto/SelectorCategoria'
import ComprobanteCarga from '../features/Registrar_Gasto/ComprobanteCarga'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useRegistrarGasto from '../hooks/useRegistrarGasto'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

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
  exitoMsg: "text-sm font-bold font-inter text-center py-2 px-3 rounded-xl mt-2",
}

function RegistrarGastoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    tipo, setTipo,
    fecha, proveedor, monto, descripcion,
    idCategoria, categorias,
    previewImagen, loading, error, erroresCampo, exito,
    handleImagenChange, handleEliminarImagen,
    handleMontoChange, handleProveedorChange,
    handleDescripcionChange, handleFechaChange,
    handleCategoriaChange, handleGuardar,
  } = useRegistrarGasto(id)

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Registro de Gastos" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>
          Ingresa los datos de tu nuevo gasto
        </p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Registro de Gasto</h1>

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

        {exito && (
          <p className={styles.exitoMsg} style={{ color: '#155724', backgroundColor: '#d4edda' }}>
            Gasto registrado correctamente
          </p>
        )}

        <button
          className={styles.guardarBtn}
          style={{ backgroundColor: loading ? COLORS.fields : COLORS.primary }}
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        <button
          className={styles.cancelarBtn}
          style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}
        >
          Cancelar
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default RegistrarGastoPage;