import {useState} from 'react';
import {List, Copy, Trash2, ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseTypeToggle from '../atoms/ExpenseTypeToggle';
import ExpenseField from '../atoms/ExpenseField';
import WithholdingSummary from '../molecules/WithholdingSummary';
import CategorySelector from '../molecules/CategorySelector';
import ForeignCurrencyFields from '../molecules/ForeignCurrencyFields';
import ToggleSection from '../molecules/ToggleSection';
import SubitemsEditor from '../molecules/SubitemsEditor';
import {filterValidSubitems, sumSubitems} from '../../../utils/expenseSubitems';
import ReceiptUpload from './ReceiptUpload';
import BackupImagesUpload from '../molecules/BackupImagesUpload';
import DatePickerInput from '../../../components/ui/DatePickerInput';

const typeLabels = {C: 'Compra sin Factura', S: 'Servicio sin Factura', F: 'Factura', R: 'Recibo'};

const styles = {
  card: "rounded-2xl shadow-md mb-4 overflow-hidden",
  header: "flex items-center justify-between px-5 py-4 cursor-pointer",
  headerInfo: "flex flex-col gap-0.5 flex-1 min-w-0",
  headerTitle: "text-sm font-bold font-inter",
  headerSub: "text-xs font-inter",
  headerError: "text-xs font-inter font-semibold mt-0.5",
  headerActions: "flex items-center gap-3 shrink-0",
  body: "px-5 pb-5 pt-4 flex flex-col gap-5",
  charCount: "text-xs font-inter text-right mt-1",
};

function ExpenseFormCard({
  item, index, expanded, onSelect, onRemove, onDuplicate, canRemove, categories, isInternationalExpense, currencies, tripRange,
  finalAmount, withholdings, hasWithholdings,
  onTypeChange, onDateChange, onSupplierChange, onReceiptNumberChange, onAmountChange, onDescriptionChange, onCategoryChange,
  onImageChange, onRemoveImage, onAddBackup, onRemoveBackup,
  onCurrencyChange, onExchangeRateChange, onBsRateChange,
  onToggleSubitems, onAddSubitem, onRemoveSubitem, onSubitemDescriptionChange, onSubitemAmountChange,
}) {
  const [subitemsExpanded, setSubitemsExpanded] = useState(true);
  const typeLabel = typeLabels[item.type] || item.type;
  const validSubitems = filterValidSubitems(item.subitems);
  const categoryName = categories.find((category) => category.id_categoria === item.categoryId)?.nombre;
  const receiptRequired = categories.find((category) => category.id_categoria === item.categoryId)?.requiere_comprobante !== false;
  const automaticAmount = item.usesSubitems;
  let amountSuffix = 'Bs';
  if (isInternationalExpense) {
    amountSuffix = item.currency;
  }

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${item.saveError ? COLORS.secondary : COLORS.dataFields}`}}>
      <div className={styles.header} style={{backgroundColor: item.saved ? COLORS.successBackground : COLORS.backgroundHeader}} onClick={() => onSelect(item.id)}>
        <div className={styles.headerInfo}>
          <p className={styles.headerTitle} style={{color: item.saved ? COLORS.success : COLORS.text}}>
            Gasto {index + 1}{item.saved ? ' — Guardado' : ''}
          </p>
          <p className={styles.headerSub} style={{color: item.saved ? COLORS.success : COLORS.labels}}>
            {categoryName || 'Sin categoría'} — {finalAmount > 0 ? `${finalAmount.toFixed(2)} ${amountSuffix}` : '0.00'}
          </p>
          {item.saveError && <p className={styles.headerError} style={{color: COLORS.secondary}}>{item.saveError}</p>}
        </div>
        <div className={styles.headerActions}>
          {!item.saved && <Copy size={16} style={{color: COLORS.primary, cursor: 'pointer'}} onClick={(event) => {event.stopPropagation(); onDuplicate(item.id);}} />}
          {canRemove && !item.saved && <Trash2 size={16} style={{color: COLORS.secondary, cursor: 'pointer'}} onClick={(event) => {event.stopPropagation(); onRemove(item.id);}} />}
          {expanded ? <ChevronUp size={18} style={{color: COLORS.labels}} /> : <ChevronDown size={18} style={{color: COLORS.labels}} />}
        </div>
      </div>
      {expanded && (
        <div className={styles.body}>
          <ExpenseTypeToggle type={item.type} onChange={(type) => onTypeChange(item.id, type)} />
          <ExpenseField label="Fecha del Gasto" required error={item.fieldErrors.date}>
            <DatePickerInput value={item.date} onChange={(value) => onDateChange(item.id, value)} disabled={item.saved} rangeStart={tripRange.start} rangeEnd={tripRange.end} />
          </ExpenseField>
          <ExpenseField label="Proveedor">
            <input type="text" placeholder="Nombre del proveedor" maxLength={50} disabled={item.saved}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
              value={item.supplier} onChange={(event) => onSupplierChange(item.id, event.target.value)} />
          </ExpenseField>
          <ExpenseField label="N° de Recibo">
            <input type="text" placeholder="Número impreso en el recibo, si tiene" maxLength={50} disabled={item.saved}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
              value={item.receiptNumber} onChange={(event) => onReceiptNumberChange(item.id, event.target.value)} />
          </ExpenseField>
          {isInternationalExpense && (
            <ForeignCurrencyFields currencies={currencies} currency={item.currency} exchangeRate={item.exchangeRate} bsRate={item.bsRate} amount={finalAmount}
              errors={item.fieldErrors} disabled={item.saved} onCurrencyChange={(value) => onCurrencyChange(item.id, value)}
              onExchangeRateChange={(value) => onExchangeRateChange(item.id, value)} onBsRateChange={(value) => onBsRateChange(item.id, value)} />
          )}
          <ExpenseField label={automaticAmount ? 'Monto (calculado automáticamente)' : 'Monto'} required={!automaticAmount} suffix={amountSuffix} error={item.fieldErrors.amount}>
            <input type="text" inputMode="decimal" placeholder="0.00" disabled={item.saved || automaticAmount}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
              value={automaticAmount ? finalAmount.toFixed(2) : item.amount} onChange={(event) => onAmountChange(item.id, event.target.value)} />
          </ExpenseField>
          <ToggleSection active={item.usesSubitems} expanded={subitemsExpanded} disabled={item.saved} icon={List} label="Subgastos"
            onToggleActive={() => {onToggleSubitems(item.id); setSubitemsExpanded(true);}} onToggleExpanded={() => setSubitemsExpanded((value) => !value)}>
            <SubitemsEditor subitems={item.subitems} errors={item.subitemErrors} currency={amountSuffix} total={sumSubitems(validSubitems)} disabled={item.saved}
              onAdd={() => onAddSubitem(item.id)} onRemove={(subitemId) => onRemoveSubitem(item.id, subitemId)}
              onDescriptionChange={(subitemId, value) => onSubitemDescriptionChange(item.id, subitemId, value)} onAmountChange={(subitemId, value) => onSubitemAmountChange(item.id, subitemId, value)} />
          </ToggleSection>
          {hasWithholdings && (
            <WithholdingSummary title={`Retenciones — ${typeLabel}`} type={item.type} paid={finalAmount} withholdings={withholdings} />
          )}
          {!item.usesSubitems && (
            <div>
              <ExpenseField label="Descripción" required error={item.fieldErrors.description}>
                <textarea className="w-full bg-transparent outline-none font-inter text-sm resize-none" style={{color: COLORS.text}} rows={4} maxLength={1000} disabled={item.saved}
                  placeholder="Detalle el motivo del gasto..." value={item.description} onChange={(event) => onDescriptionChange(item.id, event.target.value)} />
              </ExpenseField>
              <p className={styles.charCount} style={{color: COLORS.labels}}>{item.description.length}/1000</p>
            </div>
          )}
          <CategorySelector categories={categories} categoryId={item.categoryId} onChange={(id) => onCategoryChange(item.id, id)}
            error={item.fieldErrors.category} disabled={item.saved} />
          <ReceiptUpload previewImage={item.imagePreview} onChange={(file) => onImageChange(item.id, file)}
            onRemove={() => onRemoveImage(item.id)} error={item.fieldErrors.image} disabled={item.saved} required={receiptRequired} />
          {isInternationalExpense && (
            <BackupImagesUpload images={item.backups} onAdd={(file) => onAddBackup(item.id, file)} onRemove={(backupId) => onRemoveBackup(item.id, backupId)} disabled={item.saved} />
          )}
        </div>
      )}
    </div>
  );
}

export default ExpenseFormCard;