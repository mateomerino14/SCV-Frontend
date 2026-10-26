import {useState} from 'react';
import {List, Copy, Trash2, ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseTypeToggle from '../atoms/ExpenseTypeToggle';
import ExpenseField from '../atoms/ExpenseField';
import WithholdingSummary from '../molecules/WithholdingSummary';
import CategorySelector from '../molecules/CategorySelector';
import ForeignCurrencyFields from '../molecules/ForeignCurrencyFields';
import ReceiptUpload from './ReceiptUpload';
import BackupImagesUpload from '../molecules/BackupImagesUpload';

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
  toggle: "w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0",
  toggleCircle: "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
  toggleLabel: "text-sm font-bold font-inter",
  amountCalculated: "rounded-xl px-4 py-3 text-center",
  amountCalculatedLabel: "text-xs font-inter uppercase mb-1",
  amountCalculatedValue: "text-2xl font-bold font-inter",
  charCount: "text-xs font-inter text-right mt-1",
  subitemCard: "rounded-xl p-3.5 flex flex-col gap-2.5",
  subitemHeaderRow: "flex justify-between items-center",
  subitemTitle: "text-xs font-bold font-inter",
  subitemRemove: "text-xs font-bold font-inter cursor-pointer",
  addSubitemBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border",
  accordionCard: "rounded-xl border overflow-hidden",
  accordionHeader: "flex items-center justify-between p-4 gap-3",
  accordionHeaderLeft: "flex items-center gap-2 flex-1 min-w-0",
  accordionBody: "px-4 pb-4 pt-3 flex flex-col gap-3 border-t",
  accordionNote: "text-xs font-inter italic",
};

function AccordionSection({active, expanded, onToggleActive, onToggleExpanded, icon: Icon, iconColor, label, disabled, children}) {
  return (
    <div className={styles.accordionCard} style={{borderColor: active ? iconColor : COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.accordionHeader}>
        <div className={styles.accordionHeaderLeft} style={{cursor: active ? 'pointer' : 'default'}} onClick={() => active && onToggleExpanded()}>
          <Icon size={16} style={{color: iconColor}} />
          <span className={styles.toggleLabel} style={{color: COLORS.text}}>{label}</span>
        </div>
        <div className={styles.toggle} role="switch" aria-checked={active} aria-label={label} style={{backgroundColor: active ? iconColor : COLORS.dataFields, opacity: disabled ? 0.6 : 1}}
          onClick={() => !disabled && onToggleActive()}>
          <div className={styles.toggleCircle} style={{left: active ? '28px' : '4px'}} />
        </div>
      </div>
      {active && expanded && <div className={styles.accordionBody} style={{borderColor: COLORS.dataFields}}>{children}</div>}
    </div>
  );
}

function ExpenseFormCard({
  item, index, expanded, onSelect, onRemove, onDuplicate, canRemove, categories, isInternationalExpense, currencies,
  finalAmount, withholdings, hasWithholdings,
  onTypeChange, onDateChange, onSupplierChange, onReceiptNumberChange, onAmountChange, onDescriptionChange, onCategoryChange,
  onImageChange, onRemoveImage, onAddBackup, onRemoveBackup,
  onCurrencyChange, onExchangeRateChange, onBsRateChange,
  onToggleSubitems, onAddSubitem, onRemoveSubitem, onSubitemDescriptionChange, onSubitemAmountChange,
}) {
  const [subitemsExpanded, setSubitemsExpanded] = useState(true);
  const typeLabel = typeLabels[item.type] || item.type;
  const validSubitems = item.subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);
  const categoryName = categories.find((category) => category.id_categoria === item.categoryId)?.nombre;
  const receiptRequired = categories.find((category) => category.id_categoria === item.categoryId)?.requiere_comprobante !== false;
  const automaticAmount = item.usesSubitems;
  let amountSuffix = 'Bs';
  if (isInternationalExpense) {
    amountSuffix = item.currency;
  }

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${item.saveError ? COLORS.secondary : COLORS.dataFields}`}}>
      <div className={styles.header} style={{backgroundColor: item.saved ? '#d4edda' : COLORS.backgroundHeader}} onClick={() => onSelect(item.id)}>
        <div className={styles.headerInfo}>
          <p className={styles.headerTitle} style={{color: item.saved ? '#155724' : COLORS.text}}>
            Gasto {index + 1}{item.saved ? ' — Guardado' : ''}
          </p>
          <p className={styles.headerSub} style={{color: item.saved ? '#155724' : COLORS.labels}}>
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
            <input type="date" className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}} disabled={item.saved}
              value={item.date} onChange={(event) => onDateChange(item.id, event.target.value)} />
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
          <AccordionSection active={item.usesSubitems} expanded={subitemsExpanded} disabled={item.saved} icon={List} iconColor={COLORS.title} label="Lista de Subgastos"
            onToggleActive={() => {onToggleSubitems(item.id); setSubitemsExpanded(true);}} onToggleExpanded={() => setSubitemsExpanded((value) => !value)}>
            <p className={styles.accordionNote} style={{color: COLORS.labels}}>
              El monto se calculará automáticamente como la suma de estos subgastos.
            </p>
            {item.subitems.map((subitem, subitemIndex) => (
              <div key={subitem.id} className={styles.subitemCard} style={{backgroundColor: COLORS.background}}>
                <div className={styles.subitemHeaderRow}>
                  <p className={styles.subitemTitle} style={{color: COLORS.environmentTypesText}}>Subgasto {subitemIndex + 1}</p>
                  {item.subitems.length > 1 && !item.saved && (
                    <p className={styles.subitemRemove} style={{color: COLORS.secondary}} onClick={() => onRemoveSubitem(item.id, subitem.id)}>Quitar</p>
                  )}
                </div>
                <ExpenseField label="Descripción" required error={item.subitemErrors[subitem.id]?.description}>
                  <input type="text" placeholder="Ej: Almuerzo" maxLength={255} disabled={item.saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                    value={subitem.description} onChange={(event) => onSubitemDescriptionChange(item.id, subitem.id, event.target.value)} />
                </ExpenseField>
                <ExpenseField label="Monto" required suffix={amountSuffix} error={item.subitemErrors[subitem.id]?.amount}>
                  <input type="text" inputMode="decimal" placeholder="0.00" disabled={item.saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                    value={subitem.amount} onChange={(event) => onSubitemAmountChange(item.id, subitem.id, event.target.value)} />
                </ExpenseField>
              </div>
            ))}
            {!item.saved && (
              <button className={styles.addSubitemBtn} style={{borderColor: COLORS.title, color: COLORS.title}} onClick={() => onAddSubitem(item.id)}>+ Agregar otro subgasto</button>
            )}
            {validSubitems.length > 0 && (
              <div className={styles.amountCalculated} style={{backgroundColor: COLORS.background}}>
                <p className={styles.amountCalculatedLabel} style={{color: COLORS.labels}}>Suma de subgastos</p>
                <p className={styles.amountCalculatedValue} style={{color: COLORS.title}}>
                  {validSubitems.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2)} {amountSuffix}
                </p>
              </div>
            )}
          </AccordionSection>
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