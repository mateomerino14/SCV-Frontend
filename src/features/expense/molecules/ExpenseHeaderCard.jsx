import {Receipt, Globe, List, PenLine} from 'lucide-react';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-6 mb-4 shadow-md',
  top: 'flex items-start justify-between mb-4',
  title: 'text-xl font-bold font-inter leading-tight flex-1 mr-3',
  badge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-full uppercase shrink-0',
  amount: 'text-4xl font-bold font-inter',
  amountLabel: 'text-xs font-inter uppercase mt-1',
  tagsRow: 'flex flex-wrap gap-2 mt-2',
  tag: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase',
  modifiedBadge: 'inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase',
  receiptBtn: 'inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold font-inter uppercase cursor-pointer border-none',
};

function ExpenseHeaderCard({expense, typeLabel, isInternational, currency, hasInstallments, installmentsCount, hasSubitems, subitemsCount, canGenerateReceipt, sending, onSendReceipt}) {
  const showTagsRow = isInternational || hasInstallments || hasSubitems;
  return (
    <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
      <div className={styles.top}>
        <p className={styles.title} style={{color: COLORS.background}}>{expense.descripcion || (hasSubitems ? 'Gasto con varios subgastos' : '')}</p>
        <span className={styles.badge} style={{backgroundColor: 'rgba(255,255,255,0.2)', color: COLORS.background}}>{typeLabel}</span>
      </div>
      <p className={styles.amount} style={{color: COLORS.background}}>{parseFloat(expense.monto_total).toFixed(2)} {currency}</p>
      <p className={styles.amountLabel} style={{color: 'rgba(255,255,255,0.7)'}}>{isInternational ? 'Monto Total en USD' : 'Monto Total del Gasto'}</p>
      {showTagsRow && (
        <div className={styles.tagsRow}>
          {isInternational && (
            <span className={styles.tag} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)'}}>
              <Globe size={12} />
              Gasto Internacional
            </span>
          )}
          {hasInstallments && (
            <span className={styles.tag} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)'}}>
              <Globe size={12} />
              {installmentsCount} tramo{installmentsCount !== 1 ? 's' : ''} de cambio
            </span>
          )}
          {hasSubitems && (
            <span className={styles.tag} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)'}}>
              <List size={12} />
              {subitemsCount} subgasto{subitemsCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
      {expense.modificado && (
        <span className={styles.modifiedBadge} style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)'}}>
          <PenLine size={12} />
          Modificado manualmente
        </span>
      )}
      {canGenerateReceipt && (
        <button className={styles.receiptBtn} style={{backgroundColor: 'rgba(255,255,255,0.9)', color: COLORS.primary, opacity: sending ? 0.6 : 1}}
          onClick={onSendReceipt} disabled={sending}>
          <Receipt size={12} />
          {sending ? 'Enviando recibo...' : 'Enviar Recibo por Correo'}
        </button>
      )}
    </div>
  );
}

export default ExpenseHeaderCard;