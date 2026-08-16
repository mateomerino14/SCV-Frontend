import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, List, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import TipoRegistro from '../features/Registrar_Gasto/TipoRegistro'
import CampoGasto from '../features/Registrar_Gasto/CampoGasto'
import SelectorCategoria from '../features/Registrar_Gasto/SelectorCategoria'
import SelectorMoneda from '../features/Registrar_Gasto/SelectorMoneda'
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
  toggle: "w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0",
  toggleCircle: "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
  toggleLabel: "text-sm font-bold font-inter",
  montoCalculado: "rounded-xl px-4 py-3 text-center",
  montoCalculadoLabel: "text-xs font-inter uppercase mb-1",
  montoCalculadoValor: "text-2xl font-bold font-inter",
  retencionCard: "rounded-xl p-4",
  retencionTitulo: "text-xs font-bold font-inter uppercase mb-3",
  retencionFila: "flex justify-between items-center py-1.5 border-b",
  retencionFilaLast: "flex justify-between items-center py-1.5",
  retencionLabel: "text-xs font-inter",
  retencionValor: "text-xs font-bold font-inter",
  retencionTotal: "flex justify-between items-center pt-2 mt-1",
  retencionTotalLabel: "text-sm font-bold font-inter",
  retencionTotalValor: "text-sm font-bold font-inter",
  contadorCaracteres: "text-xs font-inter text-right mt-1",
  tramoCard: "rounded-xl p-3.5 flex flex-col gap-2.5",
  tramoHeaderRow: "flex justify-between items-center",
  tramoTitulo: "text-xs font-bold font-inter",
  tramoQuitar: "text-xs font-bold font-inter cursor-pointer",
  tramoEquivalente: "text-xs font-inter text-right",
  agregarTramoBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border",
  subitemCard: "rounded-xl p-3.5 flex flex-col gap-2.5",
  subitemHeaderRow: "flex justify-between items-center",
  subitemTitulo: "text-xs font-bold font-inter",
  subitemQuitar: "text-xs font-bold font-inter cursor-pointer",
  agregarSubitemBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border",
  accordionCard: "rounded-xl border overflow-hidden",
  accordionHeader: "flex items-center justify-between p-4 gap-3",
  accordionHeaderLeft: "flex items-center gap-2 flex-1 min-w-0",
  accordionBody: "px-4 pb-4 pt-3 flex flex-col gap-3 border-t",
  accordionNota: "text-xs font-inter italic",
}

function SeccionAcordeon({ activo, expandido, onToggleActivo, onToggleExpandido, icono: Icono, colorIcono, label, disabled, children }) {
  return (
    <div className={styles.accordionCard} style={{ borderColor: activo ? colorIcono : COLORS.dataFields, backgroundColor: COLORS.backgroundHeader }}>
      <div className={styles.accordionHeader}>
        <div
          className={styles.accordionHeaderLeft}
          style={{ cursor: activo ? 'pointer' : 'default' }}
          onClick={() => activo && onToggleExpandido()}
        >
          <Icono size={16} style={{ color: colorIcono }} />
          <span className={styles.toggleLabel} style={{ color: COLORS.text }}>{label}</span>
        </div>
        <div
          className={styles.toggle}
          style={{ backgroundColor: activo ? colorIcono : COLORS.dataFields, opacity: disabled ? 0.6 : 1 }}
          onClick={() => !disabled && onToggleActivo()}
        >
          <div className={styles.toggleCircle} style={{ left: activo ? '28px' : '4px' }} />
        </div>
      </div>
      {activo && expandido && (
        <div className={styles.accordionBody} style={{ borderColor: COLORS.dataFields }}>
          {children}
        </div>
      )}
    </div>
  )
}

function EditarGastoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const [tramosExpandido, setTramosExpandido] = useState(true)
  const [subitemsExpandido, setSubitemsExpandido] = useState(true)

  const {
    tipo, setTipo,
    fecha, proveedor, monto, descripcion,
    idCategoria, categorias,
    previewImagen, loading, loadingDatos,
    error, erroresCampo, guardado, idViaje,
    esGastoInternacional,
    usaOtraMoneda, setUsaOtraMoneda,
    tramos, tramosValidos, montoFinalCalculado,
    erroresTramos,
    usaSubitems, subitems, subitemsValidos, erroresSubitems,
    retenciones, tieneRetenciones,
    MONEDAS,
    handleImagenChange, handleEliminarImagen,
    handleMontoChange,
    handleAgregarTramo, handleEliminarTramo,
    handleTramoMonedaChange, handleTramoMontoChange, handleTramoTipoCambioChange,
    handleToggleSubitems, handleAgregarSubitem, handleEliminarSubitem,
    handleSubitemDescripcionChange, handleSubitemMontoChange,
    handleProveedorChange,
    handleDescripcionChange, handleFechaChange,
    handleCategoriaChange, handleGuardar,
  } = useEditarGasto(id)

  const labelTipo = tipo === 'C' ? 'Compra sin Factura' : tipo === 'S' ? 'Servicio sin Factura' : tipo === 'F' ? 'Factura' : 'Recibo'
  const montoAutomatico = !esGastoInternacional && usaSubitems

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
      <Navbar
        text={esGastoInternacional ? 'Editar Gasto Internacional' : 'Editar Gasto'}
        onMenuClick={abrirMenu}
        fotoPerfil={usuario?.foto_perfil}
      />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>
          {esGastoInternacional ? 'Modifica el gasto internacional' : 'Modifica los datos del gasto'}
        </p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>
          {esGastoInternacional ? 'Editar Gasto Internacional' : 'Editar Gasto'}
        </h1>

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

          <CampoGasto
            label={montoAutomatico ? 'Monto (calculado automáticamente)' : 'Monto'}
            sufijo={esGastoInternacional ? 'USD' : 'Bs'}
            error={erroresCampo.monto}
          >
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={montoAutomatico ? montoFinalCalculado.toFixed(2) : monto}
              onChange={(e) => handleMontoChange(e.target.value)}
              disabled={montoAutomatico}
            />
          </CampoGasto>

          {esGastoInternacional && (
            <SeccionAcordeon
              activo={usaOtraMoneda}
              expandido={tramosExpandido}
              onToggleActivo={() => { setUsaOtraMoneda(!usaOtraMoneda); setTramosExpandido(true) }}
              onToggleExpandido={() => setTramosExpandido((v) => !v)}
              icono={Globe}
              colorIcono={COLORS.primary}
              label="Cambio de Moneda (Tramos)"
            >
              <p className={styles.accordionNota} style={{ color: COLORS.labels }}>
                Registra los tramos como referencia. El monto a pagar es el que ingresaste arriba.
              </p>
              {tramos.map((t, i) => (
                <div key={t.id} className={styles.tramoCard} style={{ backgroundColor: COLORS.background }}>
                  <div className={styles.tramoHeaderRow}>
                    <p className={styles.tramoTitulo} style={{ color: COLORS.text_enviroment_types }}>
                      Tramo {i + 1}
                    </p>
                    {tramos.length > 1 && (
                      <p className={styles.tramoQuitar} style={{ color: COLORS.secondary }} onClick={() => handleEliminarTramo(t.id)}>
                        Quitar
                      </p>
                    )}
                  </div>
                  <SelectorMoneda monedas={MONEDAS} moneda={t.moneda} onChange={(v) => handleTramoMonedaChange(t.id, v)} />
                  <CampoGasto label={`Monto en ${t.moneda}`} sufijo={t.moneda} error={erroresTramos[t.id]?.monto}>
                    <input
                      className={styles.input}
                      style={{ color: COLORS.text }}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={t.montoOrigen}
                      onChange={(e) => handleTramoMontoChange(t.id, e.target.value)}
                    />
                  </CampoGasto>
                  <CampoGasto label={`Tipo de cambio (1 USD = cuántos ${t.moneda})`} sufijo={t.moneda} error={erroresTramos[t.id]?.tipoCambio}>
                    <input
                      className={styles.input}
                      style={{ color: COLORS.text }}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0000"
                      value={t.tipoCambio}
                      onChange={(e) => handleTramoTipoCambioChange(t.id, e.target.value)}
                    />
                  </CampoGasto>
                  {t.montoOrigen && t.tipoCambio && parseFloat(t.montoOrigen) > 0 && parseFloat(t.tipoCambio) > 0 && (
                    <p className={styles.tramoEquivalente} style={{ color: COLORS.title }}>
                      = {(parseFloat(t.montoOrigen) / parseFloat(t.tipoCambio)).toFixed(2)} USD
                    </p>
                  )}
                </div>
              ))}

              <button
                className={styles.agregarTramoBtn}
                style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                onClick={handleAgregarTramo}
              >
                + Agregar otro tramo
              </button>

              {tramosValidos.length > 0 && (
                <div className={styles.montoCalculado} style={{ backgroundColor: COLORS.background }}>
                  <p className={styles.montoCalculadoLabel} style={{ color: COLORS.labels }}>Suma de tramos (referencia)</p>
                  <p className={styles.montoCalculadoValor} style={{ color: COLORS.primary }}>
                    {tramosValidos.reduce((s, t) => s + (parseFloat(t.montoOrigen) / parseFloat(t.tipoCambio)), 0).toFixed(2)} USD
                  </p>
                </div>
              )}
            </SeccionAcordeon>
          )}

          <SeccionAcordeon
            activo={usaSubitems}
            expandido={subitemsExpandido}
            onToggleActivo={() => { handleToggleSubitems(); setSubitemsExpandido(true) }}
            onToggleExpandido={() => setSubitemsExpandido((v) => !v)}
            icono={List}
            colorIcono={COLORS.title}
            label="Lista de Subgastos"
          >
            <p className={styles.accordionNota} style={{ color: COLORS.labels }}>
              {esGastoInternacional
                ? 'Desglosa el gasto como referencia. El monto a pagar es el que ingresaste arriba.'
                : 'El monto se calculará automáticamente como la suma de estos subgastos.'}
            </p>
            {subitems.map((si, i) => (
              <div key={si.id} className={styles.subitemCard} style={{ backgroundColor: COLORS.background }}>
                <div className={styles.subitemHeaderRow}>
                  <p className={styles.subitemTitulo} style={{ color: COLORS.text_enviroment_types }}>
                    Subgasto {i + 1}
                  </p>
                  {subitems.length > 1 && (
                    <p className={styles.subitemQuitar} style={{ color: COLORS.secondary }} onClick={() => handleEliminarSubitem(si.id)}>
                      Quitar
                    </p>
                  )}
                </div>
                <CampoGasto label="Descripción" error={erroresSubitems[si.id]?.descripcion}>
                  <input
                    className={styles.input}
                    style={{ color: COLORS.text }}
                    type="text"
                    placeholder="Ej: Almuerzo"
                    value={si.descripcion}
                    onChange={(e) => handleSubitemDescripcionChange(si.id, e.target.value)}
                    maxLength={255}
                  />
                </CampoGasto>
                <CampoGasto label="Monto" sufijo={esGastoInternacional ? 'USD' : 'Bs'} error={erroresSubitems[si.id]?.monto}>
                  <input
                    className={styles.input}
                    style={{ color: COLORS.text }}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={si.monto}
                    onChange={(e) => handleSubitemMontoChange(si.id, e.target.value)}
                  />
                </CampoGasto>
              </div>
            ))}

            <button
              className={styles.agregarSubitemBtn}
              style={{ borderColor: COLORS.title, color: COLORS.title }}
              onClick={handleAgregarSubitem}
            >
              + Agregar otro subgasto
            </button>

            {subitemsValidos.length > 0 && (
              <div className={styles.montoCalculado} style={{ backgroundColor: COLORS.background }}>
                <p className={styles.montoCalculadoLabel} style={{ color: COLORS.labels }}>Suma de subgastos</p>
                <p className={styles.montoCalculadoValor} style={{ color: COLORS.title }}>
                  {subitemsValidos.reduce((s, si) => s + parseFloat(si.monto || 0), 0).toFixed(2)} {esGastoInternacional ? 'USD' : 'Bs'}
                </p>
              </div>
            )}
          </SeccionAcordeon>

          {tieneRetenciones && (
            <div className={styles.retencionCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
              <p className={styles.retencionTitulo} style={{ color: COLORS.text_enviroment_types }}>
                Retenciones — {labelTipo}
              </p>
              <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>Monto pagado</p>
                <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {montoFinalCalculado.toFixed(2)}</p>
              </div>
              <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>Base imponible</p>
                <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {retenciones.base.toFixed(2)}</p>
              </div>
              {tipo === 'S' && (
                <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                  <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>RC-IVA 13%</p>
                  <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {retenciones.rc_iva.toFixed(2)}</p>
                </div>
              )}
              {tipo === 'C' && (
                <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                  <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>IUE 5%</p>
                  <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {retenciones.iue.toFixed(2)}</p>
                </div>
              )}
              <div className={styles.retencionFilaLast}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>IT 3%</p>
                <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {retenciones.it.toFixed(2)}</p>
              </div>
              <div className={styles.retencionTotal}>
                <p className={styles.retencionTotalLabel} style={{ color: COLORS.title }}>Importe Costo</p>
                <p className={styles.retencionTotalValor} style={{ color: COLORS.title }}>Bs {retenciones.costo.toFixed(2)}</p>
              </div>
            </div>
          )}

          {!usaSubitems && (
            <>
              <CampoGasto label="Descripción" error={erroresCampo.descripcion}>
                <textarea
                  className={styles.textarea}
                  style={{ color: COLORS.text }}
                  placeholder="Detalle el motivo del gasto..."
                  rows={5}
                  value={descripcion}
                  onChange={(e) => handleDescripcionChange(e.target.value)}
                  maxLength={1000}
                />
              </CampoGasto>
              <p className={styles.contadorCaracteres} style={{ color: COLORS.labels }}>
                {descripcion.length}/1000
              </p>
            </>
          )}

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
            error={erroresCampo.imagen}
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