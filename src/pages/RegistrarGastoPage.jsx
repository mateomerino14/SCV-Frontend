import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, AlertTriangle, Plus, Trash2, Copy, ChevronDown, ChevronUp, List } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import TipoRegistro from '../features/Registrar_Gasto/TipoRegistro'
import CampoGasto from '../features/Registrar_Gasto/CampoGasto'
import SelectorCategoria from '../features/Registrar_Gasto/SelectorCategoria'
import SelectorMoneda from '../features/Registrar_Gasto/SelectorMoneda'
import ComprobanteCarga from '../features/Registrar_Gasto/ComprobanteCarga'
import SolicitarAutorizacionModal from '../features/Detalle_Viaje/SolicitarAutorizacionModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useRegistrarGasto from '../hooks/useRegistrarGasto'
import useSolicitudPlazo from '../hooks/useSolicitudPlazo'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  itemCard: "rounded-2xl shadow-md mb-4 overflow-hidden",
  itemHeader: "flex items-center justify-between px-5 py-4 cursor-pointer",
  itemHeaderInfo: "flex flex-col gap-0.5 flex-1 min-w-0",
  itemHeaderTitulo: "text-sm font-bold font-inter",
  itemHeaderSub: "text-xs font-inter",
  itemHeaderError: "text-xs font-inter font-semibold mt-0.5",
  itemHeaderAcciones: "flex items-center gap-3 shrink-0",
  itemBody: "px-5 pb-5 pt-4 flex flex-col gap-5",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  textarea: "w-full bg-transparent outline-none font-inter text-sm resize-none",
  errorMsg: "text-sm font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  agregarItemBtn: "w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border flex items-center justify-center gap-2 mb-4",
  solicitudBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 flex items-center justify-center gap-2",
  exitoMsg: "text-sm font-bold font-inter text-center py-2 px-3 rounded-xl mt-2",
  resumenCard: "rounded-2xl p-4 mt-3 mb-3 text-center",
  resumenTexto: "text-sm font-bold font-inter",
  resumenSubtexto: "text-xs font-inter mt-1",
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

const tipoLabels = { C: 'Compra sin Factura', S: 'Servicio sin Factura', F: 'Factura', R: 'Recibo' }

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

function ItemGastoCard({
  item, index, expandido, onSeleccionar, onEliminar, onDuplicar, puedeEliminar,
  categorias, esGastoInternacional, MONEDAS,
  montoFinal, retenciones, tieneRetenciones,
  onTipoChange, onFechaChange, onProveedorChange, onMontoChange, onDescripcionChange, onCategoriaChange,
  onImagenChange, onEliminarImagen,
  onToggleOtraMoneda, onAgregarTramo, onEliminarTramo, onTramoMonedaChange, onTramoMontoChange, onTramoTipoCambioChange,
  onToggleSubitems, onAgregarSubitem, onEliminarSubitem, onSubitemDescripcionChange, onSubitemMontoChange,
}) {
  const [tramosExpandido, setTramosExpandido] = useState(true)
  const [subitemsExpandido, setSubitemsExpandido] = useState(true)

  const labelTipo = tipoLabels[item.tipo] || item.tipo
  const tramosValidos = item.tramos.filter(t => t.moneda && parseFloat(t.montoOrigen) > 0 && parseFloat(t.tipoCambio) > 0)
  const subitemsValidos = item.subitems.filter(si => si.descripcion.trim() && parseFloat(si.monto) > 0)
  const nombreCategoria = categorias.find(c => c.id_categoria === item.idCategoria)?.nombre
  const montoAutomatico = !esGastoInternacional && item.usaSubitems

  return (
    <div className={styles.itemCard} style={{ backgroundColor: COLORS.background, border: `1px solid ${item.errorGuardado ? COLORS.secondary : COLORS.dataFields}` }}>
      <div className={styles.itemHeader} style={{ backgroundColor: item.guardado ? '#d4edda' : COLORS.backgroundHeader }} onClick={() => onSeleccionar(item.id)}>
        <div className={styles.itemHeaderInfo}>
          <p className={styles.itemHeaderTitulo} style={{ color: item.guardado ? '#155724' : COLORS.text }}>
            Gasto {index + 1}{item.guardado ? ' — Guardado' : ''}
          </p>
          <p className={styles.itemHeaderSub} style={{ color: item.guardado ? '#155724' : COLORS.labels }}>
            {nombreCategoria || 'Sin categoría'} — {montoFinal > 0 ? `${montoFinal.toFixed(2)} ${esGastoInternacional ? 'USD' : 'Bs'}` : '0.00'}
          </p>
          {item.errorGuardado && (
            <p className={styles.itemHeaderError} style={{ color: COLORS.secondary }}>
              {item.errorGuardado}
            </p>
          )}
        </div>
        <div className={styles.itemHeaderAcciones}>
          {!item.guardado && (
            <Copy size={16} style={{ color: COLORS.primary, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onDuplicar(item.id) }} />
          )}
          {puedeEliminar && !item.guardado && (
            <Trash2 size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onEliminar(item.id) }} />
          )}
          {expandido ? <ChevronUp size={18} style={{ color: COLORS.labels }} /> : <ChevronDown size={18} style={{ color: COLORS.labels }} />}
        </div>
      </div>

      {expandido && (
        <div className={styles.itemBody}>
          <TipoRegistro tipo={item.tipo} onChange={(t) => onTipoChange(item.id, t)} />

          <CampoGasto label="Fecha del Gasto" error={item.erroresCampo.fecha}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="date"
              value={item.fecha}
              onChange={(e) => onFechaChange(item.id, e.target.value)}
              disabled={item.guardado}
            />
          </CampoGasto>

          <CampoGasto label="Proveedor (Opcional)">
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              placeholder="Nombre del proveedor"
              value={item.proveedor}
              onChange={(e) => onProveedorChange(item.id, e.target.value)}
              maxLength={50}
              disabled={item.guardado}
            />
          </CampoGasto>

          <CampoGasto
            label={montoAutomatico ? 'Monto (calculado automáticamente)' : 'Monto'}
            sufijo={esGastoInternacional ? 'USD' : 'Bs'}
            error={item.erroresCampo.monto}
          >
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={montoAutomatico ? montoFinal.toFixed(2) : item.monto}
              onChange={(e) => onMontoChange(item.id, e.target.value)}
              disabled={item.guardado || montoAutomatico}
            />
          </CampoGasto>

          {esGastoInternacional && (
            <SeccionAcordeon
              activo={item.usaOtraMoneda}
              expandido={tramosExpandido}
              onToggleActivo={() => { onToggleOtraMoneda(item.id); setTramosExpandido(true) }}
              onToggleExpandido={() => setTramosExpandido((v) => !v)}
              icono={Globe}
              colorIcono={COLORS.primary}
              label="Cambio de Moneda (Tramos)"
              disabled={item.guardado}
            >
              <p className={styles.accordionNota} style={{ color: COLORS.labels }}>
                Registra los tramos como referencia. El monto a pagar es el que ingresaste arriba.
              </p>
              {item.tramos.map((t, i) => (
                <div key={t.id} className={styles.tramoCard} style={{ backgroundColor: COLORS.background }}>
                  <div className={styles.tramoHeaderRow}>
                    <p className={styles.tramoTitulo} style={{ color: COLORS.text_enviroment_types }}>
                      Tramo {i + 1}
                    </p>
                    {item.tramos.length > 1 && !item.guardado && (
                      <p className={styles.tramoQuitar} style={{ color: COLORS.secondary }} onClick={() => onEliminarTramo(item.id, t.id)}>
                        Quitar
                      </p>
                    )}
                  </div>
                  <SelectorMoneda monedas={MONEDAS} moneda={t.moneda} onChange={(v) => onTramoMonedaChange(item.id, t.id, v)} />
                  <CampoGasto label={`Monto en ${t.moneda}`} sufijo={t.moneda} error={item.erroresTramos[t.id]?.monto}>
                    <input
                      className={styles.input}
                      style={{ color: COLORS.text }}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={t.montoOrigen}
                      onChange={(e) => onTramoMontoChange(item.id, t.id, e.target.value)}
                      disabled={item.guardado}
                    />
                  </CampoGasto>
                  <CampoGasto label={`Tipo de cambio (1 USD = cuántos ${t.moneda})`} sufijo={t.moneda} error={item.erroresTramos[t.id]?.tipoCambio}>
                    <input
                      className={styles.input}
                      style={{ color: COLORS.text }}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0000"
                      value={t.tipoCambio}
                      onChange={(e) => onTramoTipoCambioChange(item.id, t.id, e.target.value)}
                      disabled={item.guardado}
                    />
                  </CampoGasto>
                  {t.montoOrigen && t.tipoCambio && parseFloat(t.montoOrigen) > 0 && parseFloat(t.tipoCambio) > 0 && (
                    <p className={styles.tramoEquivalente} style={{ color: COLORS.title }}>
                      = {(parseFloat(t.montoOrigen) / parseFloat(t.tipoCambio)).toFixed(2)} USD
                    </p>
                  )}
                </div>
              ))}

              {!item.guardado && (
                <button
                  className={styles.agregarTramoBtn}
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  onClick={() => onAgregarTramo(item.id)}
                >
                  + Agregar otro tramo
                </button>
              )}

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
            activo={item.usaSubitems}
            expandido={subitemsExpandido}
            onToggleActivo={() => { onToggleSubitems(item.id); setSubitemsExpandido(true) }}
            onToggleExpandido={() => setSubitemsExpandido((v) => !v)}
            icono={List}
            colorIcono={COLORS.title}
            label="Lista de Subgastos"
            disabled={item.guardado}
          >
            <p className={styles.accordionNota} style={{ color: COLORS.labels }}>
              {esGastoInternacional
                ? 'Desglosa el gasto como referencia. El monto a pagar es el que ingresaste arriba.'
                : 'El monto se calculará automáticamente como la suma de estos subgastos.'}
            </p>
            {item.subitems.map((si, i) => (
              <div key={si.id} className={styles.subitemCard} style={{ backgroundColor: COLORS.background }}>
                <div className={styles.subitemHeaderRow}>
                  <p className={styles.subitemTitulo} style={{ color: COLORS.text_enviroment_types }}>
                    Subgasto {i + 1}
                  </p>
                  {item.subitems.length > 1 && !item.guardado && (
                    <p className={styles.subitemQuitar} style={{ color: COLORS.secondary }} onClick={() => onEliminarSubitem(item.id, si.id)}>
                      Quitar
                    </p>
                  )}
                </div>
                <CampoGasto label="Descripción" error={item.erroresSubitems[si.id]?.descripcion}>
                  <input
                    className={styles.input}
                    style={{ color: COLORS.text }}
                    type="text"
                    placeholder="Ej: Almuerzo"
                    value={si.descripcion}
                    onChange={(e) => onSubitemDescripcionChange(item.id, si.id, e.target.value)}
                    maxLength={255}
                    disabled={item.guardado}
                  />
                </CampoGasto>
                <CampoGasto label="Monto" sufijo={esGastoInternacional ? 'USD' : 'Bs'} error={item.erroresSubitems[si.id]?.monto}>
                  <input
                    className={styles.input}
                    style={{ color: COLORS.text }}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={si.monto}
                    onChange={(e) => onSubitemMontoChange(item.id, si.id, e.target.value)}
                    disabled={item.guardado}
                  />
                </CampoGasto>
              </div>
            ))}

            {!item.guardado && (
              <button
                className={styles.agregarSubitemBtn}
                style={{ borderColor: COLORS.title, color: COLORS.title }}
                onClick={() => onAgregarSubitem(item.id)}
              >
                + Agregar otro subgasto
              </button>
            )}

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
                <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {montoFinal.toFixed(2)}</p>
              </div>
              <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>Base imponible</p>
                <p className={styles.retencionValor} style={{ color: COLORS.text }}>Bs {retenciones.base.toFixed(2)}</p>
              </div>
              {item.tipo === 'S' && (
                <div className={styles.retencionFila} style={{ borderColor: COLORS.dataFields }}>
                  <p className={styles.retencionLabel} style={{ color: COLORS.labels }}>RC-IVA 13%</p>
                  <p className={styles.retencionValor} style={{ color: COLORS.secondary }}>Bs {retenciones.rc_iva.toFixed(2)}</p>
                </div>
              )}
              {item.tipo === 'C' && (
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

          {!item.usaSubitems && (
            <div>
              <CampoGasto label="Descripción" error={item.erroresCampo.descripcion}>
                <textarea
                  className={styles.textarea}
                  style={{ color: COLORS.text }}
                  placeholder="Detalle el motivo del gasto..."
                  rows={4}
                  value={item.descripcion}
                  onChange={(e) => onDescripcionChange(item.id, e.target.value)}
                  maxLength={1000}
                  disabled={item.guardado}
                />
              </CampoGasto>
              <p className={styles.contadorCaracteres} style={{ color: COLORS.labels }}>
                {item.descripcion.length}/1000
              </p>
            </div>
          )}

          <SelectorCategoria
            categorias={categorias}
            idCategoria={item.idCategoria}
            onChange={(id) => onCategoriaChange(item.id, id)}
            error={item.erroresCampo.categoria}
          />

          <ComprobanteCarga
            previewImagen={item.previewImagen}
            onChange={(file) => onImagenChange(item.id, file)}
            onEliminar={() => onEliminarImagen(item.id)}
            error={item.erroresCampo.imagen}
          />
        </div>
      )}
    </div>
  )
}

function RegistrarGastoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const {
    items, expandidoId, categorias, esGastoInternacional,
    loadingGuardar, error, resumenGuardado,
    hayRequiereAutorizacion, todosGuardados, pendientesDeGuardar,
    MONEDAS,
    montoFinalDe, retencionesDe, tieneRetencionesDe,
    handleAgregarItem, handleDuplicarItem, handleEliminarItem, handleSeleccionarItem,
    handleTipoChange, handleFechaChange, handleProveedorChange, handleMontoChange,
    handleDescripcionChange, handleCategoriaChange,
    handleImagenChange, handleEliminarImagen,
    handleToggleOtraMoneda,
    handleAgregarTramo, handleEliminarTramo, handleTramoMonedaChange, handleTramoMontoChange, handleTramoTipoCambioChange,
    handleToggleSubitems, handleAgregarSubitem, handleEliminarSubitem, handleSubitemDescripcionChange, handleSubitemMontoChange,
    handleGuardarTodos,
  } = useRegistrarGasto(id)

  const {
    tienePendiente, fueRechazada, puedeSolicitar,
    showModal: showModalPlazo, setShowModal: setShowModalPlazo,
    enviando: enviandoPlazo, error: errorPlazo,
    handleSolicitar,
  } = useSolicitudPlazo(id)

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar
        text={esGastoInternacional ? 'Gasto Internacional' : 'Registro de Gastos'}
        onMenuClick={abrirMenu}
        fotoPerfil={usuario?.foto_perfil}
      />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <p className={styles.planLabel} style={{ color: COLORS.title }}>
          {esGastoInternacional ? 'Gastos fuera de Bolivia' : 'Ingresa los datos de tus gastos'}
        </p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>
          {esGastoInternacional ? 'Gastos Internacionales' : 'Registro de Gastos'}
        </h1>

        {tienePendiente && (
          <p className={styles.exitoMsg} style={{ backgroundColor: '#ffd700aa', color: '#7a5900' }}>
            Tienes una solicitud de autorización de plazo pendiente de revisión.
          </p>
        )}

        {items.map((item, index) => (
          <ItemGastoCard
            key={item.id}
            item={item}
            index={index}
            expandido={expandidoId === item.id}
            onSeleccionar={handleSeleccionarItem}
            onEliminar={handleEliminarItem}
            onDuplicar={handleDuplicarItem}
            puedeEliminar={items.length > 1}
            categorias={categorias}
            esGastoInternacional={esGastoInternacional}
            MONEDAS={MONEDAS}
            montoFinal={montoFinalDe(item)}
            retenciones={retencionesDe(item)}
            tieneRetenciones={tieneRetencionesDe(item)}
            onTipoChange={handleTipoChange}
            onFechaChange={handleFechaChange}
            onProveedorChange={handleProveedorChange}
            onMontoChange={handleMontoChange}
            onDescripcionChange={handleDescripcionChange}
            onCategoriaChange={handleCategoriaChange}
            onImagenChange={handleImagenChange}
            onEliminarImagen={handleEliminarImagen}
            onToggleOtraMoneda={handleToggleOtraMoneda}
            onAgregarTramo={handleAgregarTramo}
            onEliminarTramo={handleEliminarTramo}
            onTramoMonedaChange={handleTramoMonedaChange}
            onTramoMontoChange={handleTramoMontoChange}
            onTramoTipoCambioChange={handleTramoTipoCambioChange}
            onToggleSubitems={handleToggleSubitems}
            onAgregarSubitem={handleAgregarSubitem}
            onEliminarSubitem={handleEliminarSubitem}
            onSubitemDescripcionChange={handleSubitemDescripcionChange}
            onSubitemMontoChange={handleSubitemMontoChange}
          />
        ))}

        <button
          className={styles.agregarItemBtn}
          style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent' }}
          onClick={handleAgregarItem}
        >
          <Plus size={16} />
          Agregar otro gasto
        </button>

        {resumenGuardado && (
          <div className={styles.resumenCard} style={{ backgroundColor: resumenGuardado.errores > 0 ? '#fef3cd' : '#d4edda' }}>
            <p className={styles.resumenTexto} style={{ color: resumenGuardado.errores > 0 ? '#856404' : '#155724' }}>
              {resumenGuardado.guardados} gasto{resumenGuardado.guardados !== 1 ? 's' : ''} guardado{resumenGuardado.guardados !== 1 ? 's' : ''} correctamente
            </p>
            {resumenGuardado.errores > 0 && (
              <p className={styles.resumenSubtexto} style={{ color: '#856404' }}>
                {resumenGuardado.errores} gasto{resumenGuardado.errores !== 1 ? 's' : ''} con error — revisa las tarjetas marcadas en rojo
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

        {fueRechazada && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            Tu solicitud de autorización de plazo anterior fue rechazada.
          </p>
        )}

        {!todosGuardados && (
          <button
            className={styles.guardarBtn}
            style={{ backgroundColor: loadingGuardar ? COLORS.fields : COLORS.primary }}
            onClick={handleGuardarTodos}
            disabled={loadingGuardar}
          >
            {loadingGuardar ? 'Guardando...' : `Guardar ${pendientesDeGuardar} gasto${pendientesDeGuardar !== 1 ? 's' : ''}`}
          </button>
        )}

        <button
          className={styles.cancelarBtn}
          style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          onClick={() => navigate(`/dashboard/empleado/viaje/${id}`)}
        >
          {todosGuardados ? 'Volver al Viaje' : 'Cancelar'}
        </button>
      </div>

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

export default RegistrarGastoPage;