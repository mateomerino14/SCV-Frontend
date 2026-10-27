import {motion, AnimatePresence} from 'framer-motion';
import {FileSpreadsheet, CheckCircle, AlertCircle} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import InlineAlert from '../../../components/ui/InlineAlert';
import {COLORS} from '../../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  scrollWrapper: 'w-full max-w-sm md:max-w-3xl mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl',
  card: 'flex flex-col p-6 gap-3',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-xs font-inter text-center leading-snug',
  stepsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  stepBox: 'rounded-xl border p-4 flex flex-col gap-2 items-center text-center',
  stepTitle: 'text-sm font-bold font-inter',
  stepText: 'text-xs font-inter leading-snug',
  stepButton: 'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer',
  fileName: 'text-xs font-inter italic break-all',
  summaryRow: 'grid grid-cols-2 gap-2',
  summaryBox: 'rounded-xl px-3 py-2 flex items-center gap-2',
  summaryText: 'text-sm font-bold font-inter',
  list: 'flex flex-col gap-2',
  rowCard: 'rounded-xl border px-3 py-2 flex flex-col gap-1',
  rowHeader: 'flex items-center gap-2 flex-wrap',
  rowNumber: 'text-[11px] font-bold font-inter px-2 py-0.5 rounded-full',
  rowName: 'text-sm font-bold font-inter',
  rowDetail: 'text-xs font-inter break-words',
  rowError: 'text-xs font-inter',
  sectionTitle: 'text-xs font-bold font-inter uppercase mt-2',
};

const countLabel = (count, singular, plural) => {
  if (count === 1) {
    return `${count} ${singular}`;
  }
  return `${count} ${plural}`;
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PreviewRow({row}) {
  let tone = {border: COLORS.dataFields, badgeBackground: COLORS.successBackground, badgeColor: COLORS.success};
  if (!row.valido) {
    tone = {border: COLORS.secondary, badgeBackground: COLORS.error, badgeColor: COLORS.primary};
  }
  return (
    <div className={styles.rowCard} style={{borderColor: tone.border}}>
      <div className={styles.rowHeader}>
        <span className={styles.rowNumber} style={{backgroundColor: tone.badgeBackground, color: tone.badgeColor}}>Fila {row.fila}</span>
        <span className={styles.rowName} style={{color: COLORS.text}}>{row.nombre || 'Sin nombre'}</span>
      </div>
      <p className={styles.rowDetail} style={{color: COLORS.labels}}>
        {row.email_corporativo || 'Sin correo'} · {row.cargo || 'Sin cargo'} · {row.rol || 'EMPLEADO'}
        {row.correo_jefe && ` · Jefe: ${row.correo_jefe}`}
      </p>
      {row.errores.map((error) => (
        <p key={error} className={styles.rowError} style={{color: COLORS.primary}}>• {error}</p>
      ))}
    </div>
  );
}

function ImportSummary({validCount, invalidCount}) {
  return (
    <div className={styles.summaryRow}>
      <div className={styles.summaryBox} style={{backgroundColor: COLORS.successBackground}}>
        <CheckCircle size={18} style={{color: COLORS.success}} />
        <span className={styles.summaryText} style={{color: COLORS.success}}>{countLabel(validCount, 'lista para crear', 'listas para crear')}</span>
      </div>
      <div className={styles.summaryBox} style={{backgroundColor: COLORS.error}}>
        <AlertCircle size={18} style={{color: COLORS.primary}} />
        <span className={styles.summaryText} style={{color: COLORS.primary}}>{invalidCount} con errores</span>
      </div>
    </div>
  );
}

function ImportResult({result}) {
  return (
    <div className={styles.list}>
      <InlineAlert type="success">
        Se crearon {countLabel(result.creados, 'usuario', 'usuarios')}. Cada uno recibirá por correo su contraseña temporal.
      </InlineAlert>
      {result.omitidos.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Filas que no se crearon</p>
          {result.omitidos.map((row) => (
            <div key={row.fila} className={styles.rowCard} style={{borderColor: COLORS.secondary}}>
              <span className={styles.rowNumber} style={{backgroundColor: COLORS.error, color: COLORS.primary, alignSelf: 'flex-start'}}>Fila {row.fila}</span>
              {row.errores.map((error) => (
                <p key={error} className={styles.rowError} style={{color: COLORS.primary}}>• {error}</p>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function UserImportModal({isOpen, onClose, fileName, preview, result, error, validRows, invalidRows, checking, importing, downloading, onDownloadTemplate, onSelectFile, onConfirm}) {
  const handleInput = (event) => {
    onSelectFile(event.target.files[0]);
    event.target.value = '';
  };
  let fileLabel = 'Elegir archivo';
  if (checking) {
    fileLabel = 'Revisando...';
  }
  let confirmLabel = `Crear ${countLabel(validRows.length, 'usuario', 'usuarios')}`;
  if (importing) {
    confirmLabel = 'Creando...';
  }
  const hasPreview = preview.length > 0 && !result;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}}
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
          <motion.div className={styles.scrollWrapper} style={{backgroundColor: COLORS.background}}
            variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.card}>
              <ModalIconHeader icon={FileSpreadsheet} backgroundColor={COLORS.backgroundHeader} color={COLORS.text} />
              <p className={styles.title} style={{color: COLORS.text}}>Importar usuarios</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>
                Carga varias personas a la vez desde Excel. Antes de crear nada se revisa cada fila y solo se crean las correctas.
              </p>
              {!result && (
                <div className={styles.stepsGrid}>
                  <div className={styles.stepBox} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
                    <p className={styles.stepTitle} style={{color: COLORS.text}}>1. Descarga la plantilla</p>
                    <p className={styles.stepText} style={{color: COLORS.labels}}>Trae las listas de cargos, secciones y roles del sistema.</p>
                    <button type="button" className={styles.stepButton} onClick={onDownloadTemplate} disabled={downloading}
                      style={{backgroundColor: COLORS.background, color: COLORS.primary, border: `2px solid ${COLORS.primary}`, opacity: downloading ? 0.6 : 1}}>
                      {downloading ? 'Descargando...' : 'Descargar plantilla'}
                    </button>
                  </div>
                  <div className={styles.stepBox} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
                    <p className={styles.stepTitle} style={{color: COLORS.text}}>2. Sube el archivo lleno</p>
                    <p className={styles.stepText} style={{color: COLORS.labels}}>Excel (.xlsx), hasta 500 personas.</p>
                    <label className={styles.stepButton} style={{backgroundColor: COLORS.secondary, color: COLORS.background, opacity: checking || importing ? 0.6 : 1}}>
                      {fileLabel}
                      <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={handleInput} disabled={checking || importing} />
                    </label>
                    {fileName && <p className={styles.fileName} style={{color: COLORS.labels}}>{fileName}</p>}
                  </div>
                </div>
              )}
              {error && <InlineAlert>{error}</InlineAlert>}
              {hasPreview && (
                <>
                  <ImportSummary validCount={validRows.length} invalidCount={invalidRows.length} />
                  {invalidRows.length > 0 && (
                    <p className={styles.stepText} style={{color: COLORS.labels}}>
                      Las filas con errores no se crean. Puedes corregirlas en el Excel y volver a subirlo, o crear ahora las correctas y subir después las demás.
                    </p>
                  )}
                  <div className={styles.list}>
                    {invalidRows.map((row) => <PreviewRow key={row.fila} row={row} />)}
                    {validRows.map((row) => <PreviewRow key={row.fila} row={row} />)}
                  </div>
                </>
              )}
              {result && <ImportResult result={result} />}
              <ModalActions onCancel={onClose} onConfirm={onConfirm} confirmLabel={confirmLabel} loading={importing}
                cancelLabel={result ? 'Cerrar' : 'Cancelar'} onLight hideConfirm={!hasPreview} confirmDisabled={validRows.length === 0 || checking} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserImportModal;
