import { MessageSquare, Pencil, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const MAX_LENGTH = 300

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  headerRow: 'flex items-center gap-3',
  iconWrapper: 'rounded-full p-3 shrink-0',
  titulo: 'text-lg font-bold font-inter leading-tight',
  subtitulo: 'text-xs font-inter mt-0.5',
  listaWrapper: 'flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 obs-scroll',
  obsItem: 'rounded-xl p-3 flex flex-col gap-1',
  obsTexto: 'text-sm font-inter leading-relaxed break-words',
  obsFecha: 'text-xs font-inter',
  obsAcciones: 'flex gap-2 justify-end mt-1',
  obsBtnIcon: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer',
  textareaWrapper: 'w-full flex flex-col gap-1 mt-2',
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none comentario-scroll',
  errorMsg: 'text-xs font-inter italic text-center w-full',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
  vacio: 'text-xs font-inter text-center py-3',
}

const formatFechaHora = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function ObservacionesGastoModal({
  isOpen, onClose, nombreGasto,
  observaciones, puedeEditar,
  nuevoTexto, setNuevoTexto,
  onAgregar, onEditar, onEliminar,
  loading, error,
}) {
  if (!isOpen) return null

  const excedeLongitud = nuevoTexto.length > MAX_LENGTH

  const handleAgregar = () => {
    if (!nuevoTexto.trim() || excedeLongitud) return
    onAgregar()
  }

  return (
    <div className={styles.overlay}>
      <style>{`
        .obs-scroll::-webkit-scrollbar { width: 6px; }
        .obs-scroll::-webkit-scrollbar-track { background: transparent; }
        .obs-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.4); border-radius: 10px; }
        textarea.comentario-scroll {
          max-height: 140px !important;
          overflow-y: auto !important;
          scrollbar-width: thin !important;
          scrollbar-color: rgba(0, 0, 0, 0.25) transparent !important;
        }
        textarea.comentario-scroll::-webkit-scrollbar {
          width: 5px !important;
          height: 5px !important;
        }
        textarea.comentario-scroll::-webkit-scrollbar-track {
          background: transparent !important;
        }
        textarea.comentario-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.25) !important;
          border-radius: 10px !important;
          border: none !important;
        }
        textarea.comentario-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.4) !important;
        }
      `}</style>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.headerRow}>
          <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
            <MessageSquare size={20} style={{ color: COLORS.backgroundSecondary }} />
          </div>
          <div>
            <p className={styles.titulo} style={{ color: COLORS.background }}>Observaciones</p>
            {nombreGasto && (
              <p className={styles.subtitulo} style={{ color: COLORS.backgroundHeader }}>{nombreGasto}</p>
            )}
          </div>
        </div>

        <div className={styles.listaWrapper}>
          {observaciones.length === 0 ? (
            <p className={styles.vacio} style={{ color: COLORS.backgroundHeader }}>Este gasto no tiene observaciones aún</p>
          ) : (
            observaciones.map((obs) => (
              <div key={obs.id_comentario} className={styles.obsItem} style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <p className={styles.obsFecha} style={{ color: COLORS.backgroundHeader }}>{formatFechaHora(obs.fecha)}</p>
                <p className={styles.obsTexto} style={{ color: COLORS.background }}>{obs.descripcion}</p>
                {puedeEditar && (
                  <div className={styles.obsAcciones}>
                    <div className={styles.obsBtnIcon} style={{ backgroundColor: COLORS.background }} onClick={() => onEditar(obs)}>
                      <Pencil size={13} style={{ color: COLORS.primary }} />
                    </div>
                    <div className={styles.obsBtnIcon} style={{ backgroundColor: COLORS.background }} onClick={() => onEliminar(obs.id_comentario)}>
                      <Trash2 size={13} style={{ color: COLORS.primary }} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {puedeEditar && (
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              style={{
                borderColor: excedeLongitud ? COLORS.secondary : 'rgba(255,255,255,0.3)',
                color: COLORS.text,
                backgroundColor: COLORS.background,
              }}
              rows={3}
              placeholder="Escribe una nueva observación para este gasto..."
              value={nuevoTexto}
              maxLength={MAX_LENGTH}
              onChange={(e) => setNuevoTexto(e.target.value)}
            />
            {excedeLongitud && (
              <p className={styles.errorMsg} style={{ color: COLORS.background }}>
                El comentario no puede superar los {MAX_LENGTH} caracteres
              </p>
            )}
            {error && (
              <p className={styles.errorMsg} style={{ color: COLORS.background }}>{error}</p>
            )}
          </div>
        )}

        <div className={styles.buttons}>
          <Button text="Cerrar" variant="secondary" onClick={onClose} />
          {puedeEditar && (
            <Button
              text={loading ? 'Agregando...' : 'Agregar'}
              variant="primary"
              onClick={handleAgregar}
              disabled={loading || !nuevoTexto.trim() || excedeLongitud}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ObservacionesGastoModal;