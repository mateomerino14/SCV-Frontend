import {Pencil} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-5 mb-4 shadow-md',
  headerRow: 'flex items-center justify-between mb-3',
  title: 'text-xs font-bold font-inter uppercase',
  editBtn: 'flex items-center gap-1 text-xs font-bold font-inter cursor-pointer',
  amountRow: 'flex flex-col gap-1 mb-3',
  amountLabel: 'text-xs font-bold font-inter uppercase',
  amountValue: 'text-2xl font-bold font-inter',
  amountInput: 'w-full rounded-xl px-4 py-3 border text-lg font-bold font-inter outline-none',
  saveRow: 'flex gap-2 mt-2',
  saveBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center',
  requestBox: 'rounded-xl p-3 mb-4 flex flex-col gap-1',
  requestTitle: 'text-[11px] font-bold font-inter uppercase mb-1',
  requestRow: 'flex justify-between gap-3 text-xs font-inter',
};

const formatRequest = (amount, lodging, currency) => `${parseFloat(amount || 0).toFixed(2)} ${currency} (hospedaje ${parseFloat(lodging || 0).toFixed(2)})`;

function TreasurerAmountsCard({trip, isInternational, canEdit, editingAmounts, setEditingAmounts, assignedAmount, assignedAmountUsd, handleAssignedAmountChange, handleAssignedAmountUsdChange, savingAmounts, handleSaveAmounts}) {
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background}}>
      <div className={styles.headerRow}>
        <p className={styles.title} style={{color: COLORS.labels}}>Montos Asignados</p>
        {canEdit && !editingAmounts && (
          <p className={styles.editBtn} style={{color: COLORS.secondary}} onClick={() => setEditingAmounts(true)}>
            <Pencil size={13} /> Editar
          </p>
        )}
      </div>
      <div className={styles.requestBox} style={{backgroundColor: COLORS.backgroundHeader}}>
        <p className={styles.requestTitle} style={{color: COLORS.labels}}>Solicitado por el empleado</p>
        <div className={styles.requestRow} style={{color: COLORS.text}}>
          <span>Bolivianos</span>
          <span>{formatRequest(trip.monto_solicitado, trip.hospedaje_estimado, 'Bs')}</span>
        </div>
        {isInternational && (
          <div className={styles.requestRow} style={{color: COLORS.text}}>
            <span>Dólares</span>
            <span>{formatRequest(trip.monto_solicitado_usd, trip.hospedaje_estimado_usd, 'USD')}</span>
          </div>
        )}
      </div>
      {!editingAmounts ? (
        <>
          <div className={styles.amountRow}>
            <p className={styles.amountLabel} style={{color: COLORS.labels}}>Fondo Nacional (Bs)</p>
            <p className={styles.amountValue} style={{color: COLORS.title}}>Bs {parseFloat(trip.monto_asignado).toFixed(2)}</p>
          </div>
          {isInternational && (
            <div className={styles.amountRow}>
              <p className={styles.amountLabel} style={{color: COLORS.labels}}>Fondo Internacional (USD)</p>
              <p className={styles.amountValue} style={{color: COLORS.primary}}>USD {parseFloat(trip.monto_asignado_usd || 0).toFixed(2)}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.amountRow}>
            <p className={styles.amountLabel} style={{color: COLORS.labels}}>Fondo Nacional (Bs)</p>
            <input className={styles.amountInput} style={{borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}}
              type="text" inputMode="decimal" placeholder="0.00" value={assignedAmount}
              onChange={(event) => handleAssignedAmountChange(event.target.value)} />
          </div>
          {isInternational && (
            <div className={styles.amountRow}>
              <p className={styles.amountLabel} style={{color: COLORS.labels}}>Fondo Internacional (USD)</p>
              <input className={styles.amountInput} style={{borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}}
                type="text" inputMode="decimal" placeholder="0.00" value={assignedAmountUsd}
                onChange={(event) => handleAssignedAmountUsdChange(event.target.value)} />
            </div>
          )}
          <div className={styles.saveRow}>
            <button className={styles.saveBtn} style={{backgroundColor: savingAmounts ? COLORS.fields : COLORS.primary, color: COLORS.background}}
              onClick={handleSaveAmounts} disabled={savingAmounts}>
              {savingAmounts ? 'Guardando...' : 'Guardar Montos'}
            </button>
            <button className={styles.saveBtn} style={{backgroundColor: 'transparent', border: `1.5px solid ${COLORS.dataFields}`, color: COLORS.labels}}
              onClick={() => setEditingAmounts(false)}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TreasurerAmountsCard;