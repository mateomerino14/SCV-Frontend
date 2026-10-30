import {ShieldCheck, ShieldX} from 'lucide-react';
import SignerRow from '../molecules/SignerRow';
import {COLORS} from '../../../constants';

const styles = {
  card: 'w-full rounded-2xl border shadow-sm overflow-hidden',
  banner: 'flex items-center gap-3 p-5',
  bannerTitle: 'text-lg font-bold font-inter',
  bannerText: 'text-sm font-inter',
  body: 'p-5 flex flex-col gap-4',
  section: 'flex flex-col gap-1',
  sectionTitle: 'text-xs font-bold font-inter uppercase mb-1',
  grid: 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2',
  label: 'text-[11px] font-inter uppercase',
  value: 'text-sm font-inter break-words',
  divider: 'border-t',
  note: 'text-xs font-inter',
};

const summaryLabels = {
  codigo: 'Código del viaje', ruta: 'Ruta', fechas: 'Fechas', fondo_bs: 'Fondo (Bs)', fondo_usd: 'Fondo (USD)', hospedaje: 'Hospedaje',
  gastos: 'Cantidad de gastos', recibo: 'N° de recibo', pagado: 'Importe pagado (Bs)', fecha: 'Fecha', agrupado: 'Recibo agrupado',
  resultado: 'Resultado', saldo_bs: 'Saldo (Bs)', saldo_usd: 'Saldo (USD)',
};

const formatValue = (value) => {
  if (value === true) {
    return 'Sí';
  }
  if (value === false) {
    return 'No';
  }
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return String(value ?? '—');
};

const formatDateTime = (value) => new Date(value).toLocaleString('es-BO', {timeZone: 'America/La_Paz', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});

function Field({label, value}) {
  return (
    <div className="flex flex-col">
      <span className={styles.label} style={{color: COLORS.labels}}>{label}</span>
      <span className={styles.value} style={{color: COLORS.text}}>{value}</span>
    </div>
  );
}

function DocumentVerificationCard({document, error}) {
  if (error) {
    return (
      <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
        <div className={styles.banner} style={{backgroundColor: COLORS.error}}>
          <ShieldX size={34} style={{color: COLORS.secondary}} />
          <div>
            <p className={styles.bannerTitle} style={{color: COLORS.secondary}}>No pudimos verificar el documento</p>
            <p className={styles.bannerText} style={{color: COLORS.secondary}}>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  const summaryEntries = Object.entries(document.resumen || {}).filter(([key, value]) => summaryLabels[key] && !Array.isArray(value));
  const balances = (document.resumen?.saldos || []);
  return (
    <div className={styles.card} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
      <div className={styles.banner} style={{backgroundColor: COLORS.successBackground}}>
        <ShieldCheck size={34} style={{color: COLORS.successStrong}} />
        <div>
          <p className={styles.bannerTitle} style={{color: COLORS.successStrong}}>Documento auténtico</p>
          <p className={styles.bannerText} style={{color: COLORS.successStrong}}>Lo emitió el Sistema de Control de Viáticos de MAXAM FANEXA.</p>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.grid}>
          <Field label="Documento" value={document.tipo} />
          <Field label="Código" value={document.codigo} />
          <Field label="Emitido" value={formatDateTime(document.emitido)} />
          {document.viaje && <Field label="Viaje" value={document.viaje.codigo} />}
          {document.viaje && <Field label="Empleado" value={document.viaje.empleado} />}
          {document.viaje && <Field label="Destino" value={document.viaje.destino} />}
        </div>
        {(summaryEntries.length > 0 || balances.length > 0) && (
          <>
            <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
            <div className={styles.section}>
              <p className={styles.sectionTitle} style={{color: COLORS.primary}}>Datos al emitirlo</p>
              <div className={styles.grid}>
                {summaryEntries.map(([key, value]) => <Field key={key} label={summaryLabels[key]} value={formatValue(value)} />)}
                {balances.map((row) => <Field key={row.concepto} label={row.concepto} value={`Bs ${formatValue(row.bs)} · USD ${formatValue(row.usd)}`} />)}
              </div>
              <p className={styles.note} style={{color: COLORS.labels}}>Compara estos datos con los del papel: si no coinciden, el documento fue modificado.</p>
            </div>
          </>
        )}
        {document.firmas?.length > 0 && (
          <>
            <div className={styles.divider} style={{borderColor: COLORS.dataFields}} />
            <div className={styles.section}>
              <p className={styles.sectionTitle} style={{color: COLORS.primary}}>Firmas</p>
              {document.firmas.map((signer) => <SignerRow key={`${signer.etapa}-${signer.fecha}`} signer={signer} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DocumentVerificationCard;
