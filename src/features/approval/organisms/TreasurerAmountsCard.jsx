import {Pencil} from 'lucide-react';
import {COLORS} from '../../../constants';
import {fundExchangeRateOf} from '../../../utils/expenseCurrency';

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
  hint: 'text-[11px] font-inter',
  saveBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center',
};

function TreasurerAmountsCard({trip, isInternational, canEdit, editingAmounts, setEditingAmounts, assignedAmount, assignedAmountUsd, handleAssignedAmountChange, handleAssignedAmountUsdChange, fundExchangeRate, handleFundExchangeRateChange, savingAmounts, handleSaveAmounts}) {
  const savedOnlyBs = isInternational && !(parseFloat(trip.monto_asignado_usd) > 0);
  const editingOnlyBs = isInternational && !(parseFloat(assignedAmountUsd) > 0);
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
          {savedOnlyBs && (
            <div className={styles.amountRow}>
              <p className={styles.amountLabel} style={{color: COLORS.labels}}>Tipo de cambio del fondo</p>
              <p className={styles.amountValue} style={{color: COLORS.text}}>1 USD = {fundExchangeRateOf(trip).toFixed(4)} Bs</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.amountRow}>
            <p className={styles.amountLabel} style={{color: COLORS.labels}}>Fondo Nacional (Bs)<span style={{color: COLORS.secondary}}> *</span></p>
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
          {editingOnlyBs && (
            <div className={styles.amountRow}>
              <p className={styles.amountLabel} style={{color: COLORS.labels}}>Tipo de cambio del fondo (Bs por 1 USD)</p>
              <input className={styles.amountInput} style={{borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}}
                type="text" inputMode="decimal" placeholder="6.9600" value={fundExchangeRate} aria-label="Tipo de cambio del fondo"
                onChange={(event) => handleFundExchangeRateChange(event.target.value)} />
              <p className={styles.hint} style={{color: COLORS.labels}}>Con el que pasaste a Bs la parte en dólares. Fija el límite diario de los días en el exterior: tarifa en USD por este tipo de cambio.</p>
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