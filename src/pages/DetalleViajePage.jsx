import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Upload } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import GastoItem from '../features/Detalle_Viaje/GastoItem'
import PresupuestoBar from '../features/Detalle_Viaje/PresupuestoBar'
import BalanceDevolucion from '../features/Detalle_Viaje/BalanceDevolucion'
import ObservacionesViaje from '../features/Detalle_Viaje/ObservacionesViaje'
import EliminarGastoModal from '../features/Detalle_Viaje/EliminarGastoModal'
import ConfirmarRevisionModal from '../features/Detalle_Viaje/ConfirmarRevisionModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import useDetalleViaje from '../hooks/useDetalleViaje'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  badges: "flex gap-2 mb-4 flex-wrap",
  badge: "text-xs font-semibold font-inter px-3 py-1 rounded-full uppercase",
  title: "text-2xl font-bold font-inter mb-1 leading-tight",
  fecha: "text-xs font-nunito font-bold mb-1",
  destino: "text-xs font-nunito font-bold mb-4",
  card: "rounded-2xl p-5 shadow-md mb-4",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-3",
  actionRow: "flex gap-3 mb-4",
  actionBtn: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  gastosHeader: "flex items-center justify-between mb-3",
  verTodo: "text-xs font-bold font-inter cursor-pointer",
  justificacionLabel: "text-xs font-bold font-inter uppercase mb-2",
  montoJustificacion: "text-2xl font-bold font-inter mb-2",
  textarea: "w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none",
  enviarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  estadoBadge: "text-xs font-semibold font-inter px-3 py-2 rounded-xl text-center mb-4",
}



const estadoColors = {
  EN_CURSO: { backgroundColor: COLORS.primary, color: COLORS.background },
  EN_REVISION: { backgroundColor: '#85aff3ab', color: '#000a65' },
  APROBADO_SUPERVISOR: { backgroundColor: '#ffd700aa', color: '#7a5900' },
  APROBADO_FINAL: { backgroundColor: '#aafac9a2', color: '#008330' },
  RECHAZADO: { backgroundColor: '#ffa7a8aa', color: '#500203' },
}

const estadoLabels = {
  EN_REVISION: 'Este viaje ya fue enviado a revisión',
  APROBADO_SUPERVISOR: 'En espera de aprobación final',
  APROBADO_FINAL: 'Este viaje fue aprobado definitivamente',
  RECHAZADO: 'Este viaje fue rechazado',
}

const estadoTexto = {
  EN_CURSO: 'En Curso',
  EN_REVISION: 'En Revisión',
  APROBADO_SUPERVISOR: 'Aprobación Preliminar',
  APROBADO_FINAL: 'Aprobado',
  RECHAZADO: 'Rechazado',
}

const formatFecha = (f1, f2) => {
  const opts = { day: 'numeric', month: 'long', year: 'numeric' }
  return `${new Date(f1).toLocaleDateString('es-ES', opts)} — ${new Date(f2).toLocaleDateString('es-ES', opts)}`
}

function DetalleViajePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origen = location.state?.from || '/dashboard/empleado'
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    viaje, gastos, gastosMostrados, gastoAcumulado, excedePresupuesto,
    viajeEnCurso, loading, loadingEnvio, error, justificacion, setJustificacion,
    observaciones, showTodosGastos, setShowTodosGastos, showEliminarModal,
    loadingEliminar,
    showConfirmarRevisionModal, handlePedirEnviarRevision, handleConfirmarEnviarRevision,
    handleCancelarEnviarRevision, handlePedirEliminar, handleConfirmarEliminar, handleCancelarEliminar,
  } = useDetalleViaje(id)

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!viaje) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.secondary }}>No se encontró el viaje</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(origen)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <div className={styles.badges}>
          <span
            className={styles.badge}
            style={estadoColors[viaje.estado] || { backgroundColor: COLORS.primary, color: COLORS.background }}
          >
            {estadoTexto[viaje.estado] || viaje.estado.replace(/_/g, ' ')}
          </span>
          <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
            {viaje.tipo?.toUpperCase()}
          </span>
          <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
            {viaje.entorno_destino?.toUpperCase()}
          </span>
        </div>

        <h1 className={styles.title} style={{ color: COLORS.text }}>{viaje.motivo}</h1>
        <p className={styles.fecha} style={{ color: COLORS.text_enviroment_types }}>
          {formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}
        </p>
        <p className={styles.destino} style={{ color: COLORS.text_enviroment_types }}>{viaje.destino}</p>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <PresupuestoBar gastoAcumulado={gastoAcumulado} montoAsignado={viaje.monto_asignado} />
        </div>

        {viajeEnCurso && (
          <div className={styles.actionRow}>
            <button
              className={styles.actionBtn}
              style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background }}
              onClick={() => navigate(`/dashboard/empleado/viaje/${id}/registrar-gasto`)}
            >
              <PlusCircle size={16} />
              Registrar Gasto
            </button>
            <button
              className={styles.actionBtn}
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
              onClick={() => navigate(`/dashboard/empleado/viaje/${id}/subir-factura`)}
            >
              <Upload size={16} />
              Subir Facturas
            </button>
          </div>
        )}

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <div className={styles.gastosHeader}>
            <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>Gastos Registrados</p>
            {gastos.length > 3 && (
              <p className={styles.verTodo} style={{ color: COLORS.secondary }} onClick={() => setShowTodosGastos(!showTodosGastos)}>
                {showTodosGastos ? 'VER MENOS' : 'VER TODO'}
              </p>
            )}
          </div>
          {gastosMostrados.length === 0 ? (
  <p style={{ color: COLORS.labels, fontSize: '13px', textAlign: 'center', padding: '1rem 0' }}>
    No hay gastos registrados aún
  </p>
) : (
  gastosMostrados.map((gasto) => (
    <GastoItem
      key={gasto.id_gasto}
      gasto={gasto}
      viajeEnCurso={viajeEnCurso}
      onEliminar={handlePedirEliminar}
      idViaje={id}
      origenViaje={origen}
    />
  ))
)}
        </div>

        {(viajeEnCurso && excedePresupuesto) || (!viajeEnCurso && excedePresupuesto) ? (
          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <p className={styles.justificacionLabel} style={{ color: COLORS.text_enviroment_types }}>
              Justificación de Reembolso
            </p>
            {viajeEnCurso && (
              <p className={styles.montoJustificacion} style={{ color: COLORS.secondary, fontSize: '22px', fontWeight: '600' }}>
                {(gastoAcumulado - parseFloat(viaje.monto_asignado)).toFixed(2)} Bs excedidos
              </p>
            )}
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="Detalle del motivo del reembolso"
              value={justificacion}
              onChange={(e) => { if (viajeEnCurso) setJustificacion(e.target.value) }}
              readOnly={!viajeEnCurso}
              style={{
                backgroundColor: viajeEnCurso ? COLORS.background : 'rgba(243, 243, 243, 0.13)',
                borderColor: COLORS.dataFields,
                color: COLORS.text,
                cursor: viajeEnCurso ? 'text' : 'default',
              }}
            />
          </div>
        ) : null}

        {!excedePresupuesto && (
          <BalanceDevolucion gastoAcumulado={gastoAcumulado} montoAsignado={viaje.monto_asignado} />
        )}

        {(viaje.estado === 'APROBADO_SUPERVISOR' || viaje.estado === 'APROBADO_FINAL' || viaje.estado === 'RECHAZADO') && observaciones.length > 0 && (
          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <ObservacionesViaje observaciones={observaciones} />
          </div>
        )}

        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {viajeEnCurso && (
          <button
            className={styles.enviarBtn}
            style={{ backgroundColor: loadingEnvio ? COLORS.fields : COLORS.secondary }}
            onClick={handlePedirEnviarRevision}
            disabled={loadingEnvio}
          >
            {loadingEnvio ? 'Enviando...' : viaje.estado === 'RECHAZADO' ? 'Reenviar a Revisión' : 'Enviar a Revisión'}
          </button>
        )}

        {!viajeEnCurso && (
          <p className={styles.estadoBadge} style={estadoColors[viaje.estado]}>
            {estadoLabels[viaje.estado]}
          </p>
        )}
      </div>

      <EliminarGastoModal
        isOpen={showEliminarModal}
        onClose={handleCancelarEliminar}
        onConfirm={handleConfirmarEliminar}
        loading={loadingEliminar}
      />
      <ConfirmarRevisionModal isOpen={showConfirmarRevisionModal} onClose={handleCancelarEnviarRevision} onConfirm={handleConfirmarEnviarRevision} />
      <Footer />
    </div>
  )
}

export default DetalleViajePage;