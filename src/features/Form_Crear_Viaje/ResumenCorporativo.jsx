import { COLORS } from '../../constants'

const CITY_IMAGE = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"

const styles = {
  wrapper: "flex flex-col gap-4",
  card: "rounded-2xl p-6 text-white",
  presupuestoLabel: "text-xs font-inter uppercase opacity-80 mb-1",
  title: "text-2xl font-bold font-inter mb-4",
  row: "flex justify-between items-center py-3 border-b",
  rowLabel: "text-sm font-inter opacity-80 font-semibold",
  rowValue: "text-sm font-nunito",
  montoLabel: "text-xs font-inter uppercase opacity-70 mt-4 mb-1 text-center",
  monto: "text-5xl font-bold font-inter text-center",
  montoSub: "text-lg font-inter opacity-70",
  montoDivider: "border-t border-white border-opacity-20 my-3",
  montoUsdLabel: "text-xs font-inter uppercase opacity-70 mb-1 text-center",
  montoUsd: "text-4xl font-bold font-inter text-center",
  infoBox: "rounded-xl p-3 flex gap-2 items-start mt-4",
  infoText: "text-xs font-inter opacity-80",
  cityCard: "rounded-2xl overflow-hidden relative h-44",
  cityImage: "w-full h-full object-cover",
  cityOverlay: "absolute bottom-0 left-0 right-0 p-3",
  cityTitle: "text-white font-bold font-inter text-sm",
  citySubtitle: "text-white font-inter text-xs opacity-70 uppercase",
}

function ResumenCorporativo({ cargo, tarifaDiaria, tarifaDiariaUsd, montoTotal, montoTotalUsd, diasNacionales, diasInternacionales, tipo, transporte }) {
  const esInternacional = tipo === 'Internacional'

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})` }}>
        <p className={styles.presupuestoLabel}>Presupuesto Asignado</p>
        <p className={styles.title}>Resumen Corporativo</p>

        <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span className={styles.rowLabel}>Cargo:</span>
          <span className={styles.rowValue}>{cargo?.toUpperCase() || '—'}</span>
        </div>

        <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span className={styles.rowLabel}>Tarifa Diaria (Bs):</span>
          <span className={styles.rowValue}>{tarifaDiaria.toFixed(2)} Bs</span>
        </div>

        {esInternacional && (
          <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <span className={styles.rowLabel}>Tarifa Diaria (USD):</span>
            <span className={styles.rowValue}>{(tarifaDiariaUsd || 0).toFixed(2)} USD</span>
          </div>
        )}

        <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span className={styles.rowLabel}>Transporte:</span>
          <span className={styles.rowValue}>{transporte || '—'}</span>
        </div>

        {esInternacional ? (
          <>
            <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <span className={styles.rowLabel}>Días nacionales (Bs):</span>
              <span className={styles.rowValue}>{diasNacionales} día{diasNacionales !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <span className={styles.rowLabel}>Días internacionales (USD):</span>
              <span className={styles.rowValue}>{diasInternacionales} día{diasInternacionales !== 1 ? 's' : ''}</span>
            </div>

            <p className={styles.montoLabel}>Presupuesto Nacional</p>
            <p className={styles.monto}>
              {montoTotal.toFixed(2)} <span className={styles.montoSub}>Bs</span>
            </p>

            <div className={styles.montoDivider} />

            <p className={styles.montoUsdLabel}>Presupuesto Internacional</p>
            <p className={styles.montoUsd}>
              {(montoTotalUsd || 0).toFixed(2)} <span className={styles.montoSub}>USD</span>
            </p>
          </>
        ) : (
          <>
            <div className={styles.row} style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <span className={styles.rowLabel}>Días de viaje:</span>
              <span className={styles.rowValue}>{diasNacionales} día{diasNacionales !== 1 ? 's' : ''}</span>
            </div>
            <p className={styles.montoLabel}>Monto Total Estimado</p>
            <p className={styles.monto}>
              {montoTotal.toFixed(2)} <span className={styles.montoSub}>Bs</span>
            </p>
          </>
        )}

        <div className={styles.infoBox} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>ⓘ</span>
          <p className={styles.infoText}>
            {esInternacional
              ? 'Para viajes internacionales, el primer y último día se calculan en Bs. Los días intermedios en USD.'
              : 'El monto total se calcula automáticamente basado en su nivel jerárquico y la duración seleccionada.'}
          </p>
        </div>
      </div>

      <div className={styles.cityCard}>
        <img src={CITY_IMAGE} alt="ciudad" className={styles.cityImage} />
        <div className={styles.cityOverlay} style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
          <p className={styles.cityTitle}>Centro de Convenciones</p>
          <p className={styles.citySubtitle}>Zona Ejecutiva</p>
        </div>
      </div>
    </div>
  )
}

export default ResumenCorporativo;