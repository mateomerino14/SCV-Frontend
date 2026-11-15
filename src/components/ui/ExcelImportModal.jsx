import {motion, AnimatePresence} from 'framer-motion';
import {FileSpreadsheet, CheckCircle, AlertCircle} from 'lucide-react';
import ModalIconHeader from './ModalIconHeader';
import ModalActions from './ModalActions';
import InlineAlert from './InlineAlert';
import {COLORS} from '../../constants';

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

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function PreviewRow({row, rowTitle, rowDetail}) {
  let tone = {border: COLORS.dataFields, badgeBackground: COLORS.successBackground, badgeColor: COLORS.success};
  if (!row.valido) {
    tone = {border: COLORS.secondary, badgeBackground: COLORS.error, badgeColor: COLORS.primary};
  }
  return (
    <div className={styles.rowCard} style={{borderColor: tone.border}}>
      <div className={styles.rowHeader}>
        <span className={styles.rowNumber} style={{backgroundColor: tone.badgeBackground, color: tone.badgeColor}}>Fila {row.fila}</span>
        <span className={styles.rowName} style={{color: COLORS.text}}>{rowTitle(row)}</span>
        {row.valido && row.accion && (
          <span className={styles.rowNumber} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.primary}}>{row.accion}</span>
        )}
      </div>
      <p className={styles.rowDetail} style={{color: COLORS.labels}}>{rowDetail(row)}</p>
      {row.errores.map((error) => (
        <p key={error} className={styles.rowError} style={{color: COLORS.primary}}>• {error}</p>
      ))}
    </div>
  );
}

function ImportSummary({validCount, invalidCount, validLabel}) {
  return (
    <div className={styles.summaryRow}>
      <div className={styles.summaryBox} style={{backgroundColor: COLORS.successBackground}}>
        <CheckCircle size={18} style={{color: COLORS.success}} />
        <span className={styles.summaryText} style={{color: COLORS.success}}>{validLabel(validCount)}</span>
      </div>
      <div className={styles.summaryBox} style={{backgroundColor: COLORS.error}}>
        <AlertCircle size={18} style={{color: COLORS.primary}} />
        <span className={styles.summaryText} style={{color: COLORS.primary}}>{invalidCount} con errores</span>
      </div>
    </div>
  );
}

function ImportResult({result, resultText}) {
  return (
    <div className={styles.list}>
      <InlineAlert type="success">
        {resultText(result)}
      </InlineAlert>
      {result.omitidos.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Filas que no se guardaron</p>
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

function ExcelImportModal({texts, isOpen, onClose, fileName, preview, result, error, validRows, invalidRows, actionableRows, checking, importing, downloading, onDownloadTemplate, onSelectFile, onConfirm}) {
  const handleInput = (event) => {
    onSelectFile(event.target.files[0]);
    event.target.value = '';
  };
  let fileLabel = 'Elegir archivo';
  if (checking) {
    fileLabel = 'Revisando...';
  }
  let confirmLabel = texts.confirmLabel(actionableRows.length);
  if (importing) {
    confirmLabel = 'Guardando...';
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
              <p className={styles.title} style={{color: COLORS.text}}>{texts.title}</p>
              <p className={styles.subtitle} style={{color: COLORS.labels}}>
                {texts.subtitle}
              </p>
              {!result && (
                <div className={styles.stepsGrid}>
                  <div className={styles.stepBox} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
                    <p className={styles.stepTitle} style={{color: COLORS.text}}>1. Descarga la plantilla</p>
                    <p className={styles.stepText} style={{color: COLORS.labels}}>{texts.templateHint}</p>
                    <button type="button" className={styles.stepButton} onClick={onDownloadTemplate} disabled={downloading}
                      style={{backgroundColor: COLORS.background, color: COLORS.primary, border: `2px solid ${COLORS.primary}`, opacity: downloading ? 0.6 : 1}}>
                      {downloading ? 'Descargando...' : 'Descargar plantilla'}
                    </button>
                  </div>
                  <div className={styles.stepBox} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
                    <p className={styles.stepTitle} style={{color: COLORS.text}}>2. Sube el archivo lleno</p>
                    <p className={styles.stepText} style={{color: COLORS.labels}}>{texts.fileHint}</p>
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
                  <ImportSummary validCount={validRows.length} invalidCount={invalidRows.length} validLabel={texts.validLabel} />
                  {invalidRows.length > 0 && (
                    <p className={styles.stepText} style={{color: COLORS.labels}}>
                      Las filas con errores no se guardan. Puedes corregirlas en el Excel y volver a subirlo, o guardar ahora las correctas y subir después las demás.
                    </p>
                  )}
                  <div className={styles.list}>
                    {invalidRows.map((row) => <PreviewRow key={row.fila} row={row} rowTitle={texts.rowTitle} rowDetail={texts.rowDetail} />)}
                    {validRows.map((row) => <PreviewRow key={row.fila} row={row} rowTitle={texts.rowTitle} rowDetail={texts.rowDetail} />)}
                  </div>
                </>
              )}
              {result && <ImportResult result={result} resultText={texts.resultText} />}
              <ModalActions onCancel={onClose} onConfirm={onConfirm} confirmLabel={confirmLabel} loading={importing}
                cancelLabel={result ? 'Cerrar' : 'Cancelar'} onLight hideConfirm={!hasPreview} confirmDisabled={actionableRows.length === 0 || checking} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExcelImportModal;
