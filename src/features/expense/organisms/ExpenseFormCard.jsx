import {useState} from 'react';
import {Globe, List, Copy, Trash2, ChevronDown, ChevronUp} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseTypeToggle from '../atoms/ExpenseTypeToggle';
import ExpenseField from '../atoms/ExpenseField';
import CategorySelector from '../molecules/CategorySelector';
import CurrencySelector from '../molecules/CurrencySelector';
import ReceiptUpload from './ReceiptUpload';

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
  withholdingCard: "rounded-xl p-4",
  withholdingTitle: "text-xs font-bold font-inter uppercase mb-3",
  withholdingRow: "flex justify-between items-center py-1.5 border-b",
  withholdingRowLast: "flex justify-between items-center py-1.5",
  withholdingLabel: "text-xs font-inter",
  withholdingValue: "text-xs font-bold font-inter",
  withholdingTotal: "flex justify-between items-center pt-2 mt-1",
  withholdingTotalLabel: "text-sm font-bold font-inter",
  withholdingTotalValue: "text-sm font-bold font-inter",
  charCount: "text-xs font-inter text-right mt-1",
  installmentCard: "rounded-xl p-3.5 flex flex-col gap-2.5",
  installmentHeaderRow: "flex justify-between items-center",
  installmentTitle: "text-xs font-bold font-inter",
  installmentRemove: "text-xs font-bold font-inter cursor-pointer",
  installmentEquivalent: "text-xs font-inter text-right",
  addInstallmentBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border",
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
        <div className={styles.toggle} style={{backgroundColor: active ? iconColor : COLORS.dataFields, opacity: disabled ? 0.6 : 1}}
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
  onTypeChange, onDateChange, onSupplierChange, onAmountChange, onDescriptionChange, onCategoryChange,
  onImageChange, onRemoveImage,
  onToggleOtherCurrency, onAddInstallment, onRemoveInstallment, onInstallmentCurrencyChange, onInstallmentAmountChange, onInstallmentExchangeRateChange,
  onToggleSubitems, onAddSubitem, onRemoveSubitem, onSubitemDescriptionChange, onSubitemAmountChange,
}) {
  const [installmentsExpanded, setInstallmentsExpanded] = useState(true);
  const [subitemsExpanded, setSubitemsExpanded] = useState(true);
  const typeLabel = typeLabels[item.type] || item.type;
  const validInstallments = item.installments.filter((installment) => installment.currency && parseFloat(installment.originAmount) > 0 && parseFloat(installment.exchangeRate) > 0);
  const validSubitems = item.subitems.filter((subitem) => subitem.description.trim() && parseFloat(subitem.amount) > 0);
  const categoryName = categories.find((category) => category.id_categoria === item.categoryId)?.nombre;
  const receiptRequired = categories.find((category) => category.id_categoria === item.categoryId)?.requiere_comprobante !== false;
  const automaticAmount = item.usesSubitems;

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${item.saveError ? COLORS.secondary : COLORS.dataFields}`}}>
      <div className={styles.header} style={{backgroundColor: item.saved ? '#d4edda' : COLORS.backgroundHeader}} onClick={() => onSelect(item.id)}>
        <div className={styles.headerInfo}>
          <p className={styles.headerTitle} style={{color: item.saved ? '#155724' : COLORS.text}}>
            Gasto {index + 1}{item.saved ? ' — Guardado' : ''}
          </p>
          <p className={styles.headerSub} style={{color: item.saved ? '#155724' : COLORS.labels}}>
            {categoryName || 'Sin categoría'} — {finalAmount > 0 ? `${finalAmount.toFixed(2)} ${isInternationalExpense ? 'USD' : 'Bs'}` : '0.00'}
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
          <ExpenseField label="Fecha del Gasto" error={item.fieldErrors.date}>
            <input type="date" className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}} disabled={item.saved}
              value={item.date} onChange={(event) => onDateChange(item.id, event.target.value)} />
          </ExpenseField>
          <ExpenseField label="Proveedor (Opcional)">
            <input type="text" placeholder="Nombre del proveedor" maxLength={50} disabled={item.saved}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
              value={item.supplier} onChange={(event) => onSupplierChange(item.id, event.target.value)} />
          </ExpenseField>
          <ExpenseField label={automaticAmount ? 'Monto (calculado automáticamente)' : 'Monto'} suffix={isInternationalExpense ? 'USD' : 'Bs'} error={item.fieldErrors.amount}>
            <input type="text" inputMode="decimal" placeholder="0.00" disabled={item.saved || automaticAmount}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
              value={automaticAmount ? finalAmount.toFixed(2) : item.amount} onChange={(event) => onAmountChange(item.id, event.target.value)} />
          </ExpenseField>
          {isInternationalExpense && (
            <AccordionSection active={item.usesOtherCurrency} expanded={installmentsExpanded} disabled={item.saved} icon={Globe} iconColor={COLORS.primary} label="Cambio de Moneda (Tramos)"
              onToggleActive={() => {onToggleOtherCurrency(item.id); setInstallmentsExpanded(true);}} onToggleExpanded={() => setInstallmentsExpanded((value) => !value)}>
              <p className={styles.accordionNote} style={{color: COLORS.labels}}>Registra los tramos como referencia. El monto a pagar es el que ingresaste arriba.</p>
              {item.installments.map((installment, installmentIndex) => (
                <div key={installment.id} className={styles.installmentCard} style={{backgroundColor: COLORS.background}}>
                  <div className={styles.installmentHeaderRow}>
                    <p className={styles.installmentTitle} style={{color: COLORS.environmentTypesText}}>Tramo {installmentIndex + 1}</p>
                    {item.installments.length > 1 && !item.saved && (
                      <p className={styles.installmentRemove} style={{color: COLORS.secondary}} onClick={() => onRemoveInstallment(item.id, installment.id)}>Quitar</p>
                    )}
                  </div>
                  <CurrencySelector currencies={currencies} currency={installment.currency} onChange={(value) => onInstallmentCurrencyChange(item.id, installment.id, value)} />
                  <ExpenseField label={`Monto en ${installment.currency}`} suffix={installment.currency} error={item.installmentErrors[installment.id]?.amount}>
                    <input type="text" inputMode="decimal" placeholder="0.00" disabled={item.saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                      value={installment.originAmount} onChange={(event) => onInstallmentAmountChange(item.id, installment.id, event.target.value)} />
                  </ExpenseField>
                  <ExpenseField label={`Tipo de cambio (1 USD = cuántos ${installment.currency})`} suffix={installment.currency} error={item.installmentErrors[installment.id]?.exchangeRate}>
                    <input type="text" inputMode="decimal" placeholder="0.0000" disabled={item.saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                      value={installment.exchangeRate} onChange={(event) => onInstallmentExchangeRateChange(item.id, installment.id, event.target.value)} />
                  </ExpenseField>
                  {installment.originAmount && installment.exchangeRate && parseFloat(installment.originAmount) > 0 && parseFloat(installment.exchangeRate) > 0 && (
                    <p className={styles.installmentEquivalent} style={{color: COLORS.title}}>= {(parseFloat(installment.originAmount) / parseFloat(installment.exchangeRate)).toFixed(2)} USD</p>
                  )}
                </div>
              ))}
              {!item.saved && (
                <button className={styles.addInstallmentBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => onAddInstallment(item.id)}>+ Agregar otro tramo</button>
              )}
              {validInstallments.length > 0 && (
                <div className={styles.amountCalculated} style={{backgroundColor: COLORS.background}}>
                  <p className={styles.amountCalculatedLabel} style={{color: COLORS.labels}}>Suma de tramos (referencia)</p>
                  <p className={styles.amountCalculatedValue} style={{color: COLORS.primary}}>
                    {validInstallments.reduce((sum, installment) => sum + (parseFloat(installment.originAmount) / parseFloat(installment.exchangeRate)), 0).toFixed(2)} USD
                  </p>
                </div>
              )}
            </AccordionSection>
          )}
          <AccordionSection active={item.usesSubitems} expanded={subitemsExpanded} disabled={item.saved} icon={List} iconColor={COLORS.title} label="Lista de Subgastos"
            onToggleActive={() => {onToggleSubitems(item.id); setSubitemsExpanded(true);}} onToggleExpanded={() => setSubitemsExpanded((value) => !value)}>
            <p className={styles.accordionNote} style={{color: COLORS.labels}}>
              {isInternationalExpense ? 'El monto se calculará automáticamente como la suma de estos subgastos.' : 'El monto se calculará automáticamente como la suma de estos subgastos.'}
            </p>
            {item.subitems.map((subitem, subitemIndex) => (
              <div key={subitem.id} className={styles.subitemCard} style={{backgroundColor: COLORS.background}}>
                <div className={styles.subitemHeaderRow}>
                  <p className={styles.subitemTitle} style={{color: COLORS.environmentTypesText}}>Subgasto {subitemIndex + 1}</p>
                  {item.subitems.length > 1 && !item.saved && (
                    <p className={styles.subitemRemove} style={{color: COLORS.secondary}} onClick={() => onRemoveSubitem(item.id, subitem.id)}>Quitar</p>
                  )}
                </div>
                <ExpenseField label="Descripción" error={item.subitemErrors[subitem.id]?.description}>
                  <input type="text" placeholder="Ej: Almuerzo" maxLength={255} disabled={item.saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                    value={subitem.description} onChange={(event) => onSubitemDescriptionChange(item.id, subitem.id, event.target.value)} />
                </ExpenseField>
                <ExpenseField label="Monto" suffix={isInternationalExpense ? 'USD' : 'Bs'} error={item.subitemErrors[subitem.id]?.amount}>
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
                  {validSubitems.reduce((sum, subitem) => sum + parseFloat(subitem.amount || 0), 0).toFixed(2)} {isInternationalExpense ? 'USD' : 'Bs'}
                </p>
              </div>
            )}
          </AccordionSection>
          {hasWithholdings && (
            <div className={styles.withholdingCard} style={{backgroundColor: COLORS.backgroundHeader}}>
              <p className={styles.withholdingTitle} style={{color: COLORS.environmentTypesText}}>Retenciones — {typeLabel}</p>
              <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
                <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>Monto pagado</p>
                <p className={styles.withholdingValue} style={{color: COLORS.text}}>Bs {finalAmount.toFixed(2)}</p>
              </div>
              <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
                <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>Base imponible</p>
                <p className={styles.withholdingValue} style={{color: COLORS.text}}>Bs {withholdings.base.toFixed(2)}</p>
              </div>
              {item.type === 'S' && (
                <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
                  <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>RC-IVA 13%</p>
                  <p className={styles.withholdingValue} style={{color: COLORS.secondary}}>Bs {withholdings.rcIva.toFixed(2)}</p>
                </div>
              )}
              {item.type === 'C' && (
                <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
                  <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>IUE 5%</p>
                  <p className={styles.withholdingValue} style={{color: COLORS.secondary}}>Bs {withholdings.iue.toFixed(2)}</p>
                </div>
              )}
              <div className={styles.withholdingRowLast}>
                <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>IT 3%</p>
                <p className={styles.withholdingValue} style={{color: COLORS.secondary}}>Bs {withholdings.it.toFixed(2)}</p>
              </div>
              <div className={styles.withholdingTotal}>
                <p className={styles.withholdingTotalLabel} style={{color: COLORS.title}}>Importe Costo</p>
                <p className={styles.withholdingTotalValue} style={{color: COLORS.title}}>Bs {withholdings.cost.toFixed(2)}</p>
              </div>
            </div>
          )}
          {!item.usesSubitems && (
            <div>
              <ExpenseField label="Descripción" error={item.fieldErrors.description}>
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
        </div>
      )}
    </div>
  );
}

export default ExpenseFormCard;