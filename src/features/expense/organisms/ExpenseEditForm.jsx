import {Globe, List} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseTypeToggle from '../atoms/ExpenseTypeToggle';
import ExpenseField from '../atoms/ExpenseField';
import CategorySelector from '../molecules/CategorySelector';
import CurrencySelector from '../molecules/CurrencySelector';
import ReceiptUpload from './ReceiptUpload';

const styles = {
  toggle: "w-12 h-6 rounded-full relative cursor-pointer transition-colors shrink-0",
  toggleCircle: "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
  toggleLabel: "text-sm font-bold font-inter",
  accordionCard: "rounded-xl border overflow-hidden",
  accordionHeader: "flex items-center justify-between p-4 gap-3",
  accordionHeaderLeft: "flex items-center gap-2 flex-1 min-w-0",
  accordionBody: "px-4 pb-4 pt-3 flex flex-col gap-3 border-t",
  accordionNote: "text-xs font-inter italic",
  amountCalculated: "rounded-xl px-4 py-3 text-center",
  amountCalculatedLabel: "text-xs font-inter uppercase mb-1",
  amountCalculatedValue: "text-2xl font-bold font-inter",
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
};

function AccordionSection({active, onToggleActive, icon: Icon, iconColor, label, disabled, children}) {
  return (
    <div className={styles.accordionCard} style={{borderColor: active ? iconColor : COLORS.dataFields, backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.accordionHeader}>
        <div className={styles.accordionHeaderLeft}>
          <Icon size={16} style={{color: iconColor}} />
          <span className={styles.toggleLabel} style={{color: COLORS.text}}>{label}</span>
        </div>
        <div className={styles.toggle} style={{backgroundColor: active ? iconColor : COLORS.dataFields, opacity: disabled ? 0.6 : 1}}
          onClick={() => !disabled && onToggleActive()}>
          <div className={styles.toggleCircle} style={{left: active ? '28px' : '4px'}} />
        </div>
      </div>
      {active && <div className={styles.accordionBody} style={{borderColor: COLORS.dataFields}}>{children}</div>}
    </div>
  );
}

function ExpenseEditForm({
  type, date, supplier, amount, description, categoryId, categories, imagePreview, fieldErrors, saved,
  isInternationalExpense, usesOtherCurrency, setUsesOtherCurrency, installments, validInstallments, installmentErrors,
  usesSubitems, subitems, validSubitems, subitemErrors, currencies, withholdings, hasWithholdings, finalAmount,
  handleTypeChange, handleDateChange, handleSupplierChange, handleAmountChange, handleDescriptionChange, handleCategoryChange,
  handleImageChange, handleRemoveImage,
  handleAddInstallment, handleRemoveInstallment, handleInstallmentCurrencyChange, handleInstallmentAmountChange, handleInstallmentExchangeRateChange,
  handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
}) {
  const automaticAmount = usesSubitems;
  return (
    <>
      <ExpenseTypeToggle type={type} onChange={(newType) => !saved && handleTypeChange(newType)} />
      <ExpenseField label="Fecha del Gasto" error={fieldErrors.date}>
        <input type="date" className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}} disabled={saved}
          value={date} onChange={(event) => handleDateChange(event.target.value)} />
      </ExpenseField>
      <ExpenseField label="Proveedor (Opcional)">
        <input type="text" placeholder="Nombre del proveedor" maxLength={50} disabled={saved}
          className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
          value={supplier} onChange={(event) => handleSupplierChange(event.target.value)} />
      </ExpenseField>
      <ExpenseField label={automaticAmount ? 'Monto (calculado automáticamente)' : 'Monto'} suffix={isInternationalExpense ? 'USD' : 'Bs'} error={fieldErrors.amount}>
        <input type="text" inputMode="decimal" placeholder="0.00" disabled={saved || automaticAmount}
          className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
          value={automaticAmount ? finalAmount.toFixed(2) : amount} onChange={(event) => handleAmountChange(event.target.value)} />
      </ExpenseField>
      {isInternationalExpense && (
        <AccordionSection active={usesOtherCurrency} disabled={saved} icon={Globe} iconColor={COLORS.primary} label="Cambio de Moneda (Tramos)"
          onToggleActive={() => setUsesOtherCurrency(!usesOtherCurrency)}>
          <p className={styles.accordionNote} style={{color: COLORS.labels}}>Registra los tramos como referencia. El monto a pagar es el que ingresaste arriba.</p>
          {installments.map((installment, index) => (
            <div key={installment.id} className={styles.installmentCard} style={{backgroundColor: COLORS.background}}>
              <div className={styles.installmentHeaderRow}>
                <p className={styles.installmentTitle} style={{color: COLORS.environmentTypesText}}>Tramo {index + 1}</p>
                {installments.length > 1 && !saved && (
                  <p className={styles.installmentRemove} style={{color: COLORS.secondary}} onClick={() => handleRemoveInstallment(installment.id)}>Quitar</p>
                )}
              </div>
              <CurrencySelector currencies={currencies} currency={installment.currency} onChange={(value) => handleInstallmentCurrencyChange(installment.id, value)} />
              <ExpenseField label={`Monto en ${installment.currency}`} suffix={installment.currency} error={installmentErrors[installment.id]?.amount}>
                <input type="text" inputMode="decimal" placeholder="0.00" disabled={saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                  value={installment.originAmount} onChange={(event) => handleInstallmentAmountChange(installment.id, event.target.value)} />
              </ExpenseField>
              <ExpenseField label={`Tipo de cambio (1 USD = cuántos ${installment.currency})`} suffix={installment.currency} error={installmentErrors[installment.id]?.exchangeRate}>
                <input type="text" inputMode="decimal" placeholder="0.0000" disabled={saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                  value={installment.exchangeRate} onChange={(event) => handleInstallmentExchangeRateChange(installment.id, event.target.value)} />
              </ExpenseField>
              {installment.originAmount && installment.exchangeRate && parseFloat(installment.originAmount) > 0 && parseFloat(installment.exchangeRate) > 0 && (
                <p className={styles.installmentEquivalent} style={{color: COLORS.title}}>= {(parseFloat(installment.originAmount) / parseFloat(installment.exchangeRate)).toFixed(2)} USD</p>
              )}
            </div>
          ))}
          {!saved && (
            <button className={styles.addInstallmentBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={handleAddInstallment}>+ Agregar otro tramo</button>
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
      <AccordionSection active={usesSubitems} disabled={saved} icon={List} iconColor={COLORS.title} label="Lista de Subgastos" onToggleActive={handleToggleSubitems}>
        <p className={styles.accordionNote} style={{color: COLORS.labels}}>
          El monto se calculará automáticamente como la suma de estos subgastos.
        </p>
        {subitems.map((subitem, index) => (
          <div key={subitem.id} className={styles.subitemCard} style={{backgroundColor: COLORS.background}}>
            <div className={styles.subitemHeaderRow}>
              <p className={styles.subitemTitle} style={{color: COLORS.environmentTypesText}}>Subgasto {index + 1}</p>
              {subitems.length > 1 && !saved && (
                <p className={styles.subitemRemove} style={{color: COLORS.secondary}} onClick={() => handleRemoveSubitem(subitem.id)}>Quitar</p>
              )}
            </div>
            <ExpenseField label="Descripción" error={subitemErrors[subitem.id]?.description}>
              <input type="text" placeholder="Ej: Almuerzo" maxLength={255} disabled={saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                value={subitem.description} onChange={(event) => handleSubitemDescriptionChange(subitem.id, event.target.value)} />
            </ExpenseField>
            <ExpenseField label="Monto" suffix={isInternationalExpense ? 'USD' : 'Bs'} error={subitemErrors[subitem.id]?.amount}>
              <input type="text" inputMode="decimal" placeholder="0.00" disabled={saved} className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
                value={subitem.amount} onChange={(event) => handleSubitemAmountChange(subitem.id, event.target.value)} />
            </ExpenseField>
          </div>
        ))}
        {!saved && (
          <button className={styles.addSubitemBtn} style={{borderColor: COLORS.title, color: COLORS.title}} onClick={handleAddSubitem}>+ Agregar otro subgasto</button>
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
          <p className={styles.withholdingTitle} style={{color: COLORS.environmentTypesText}}>Retenciones</p>
          <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
            <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>Monto pagado</p>
            <p className={styles.withholdingValue} style={{color: COLORS.text}}>Bs {finalAmount.toFixed(2)}</p>
          </div>
          <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
            <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>Base imponible</p>
            <p className={styles.withholdingValue} style={{color: COLORS.text}}>Bs {withholdings.base.toFixed(2)}</p>
          </div>
          {type === 'S' && (
            <div className={styles.withholdingRow} style={{borderColor: COLORS.dataFields}}>
              <p className={styles.withholdingLabel} style={{color: COLORS.labels}}>RC-IVA 13%</p>
              <p className={styles.withholdingValue} style={{color: COLORS.secondary}}>Bs {withholdings.rcIva.toFixed(2)}</p>
            </div>
          )}
          {type === 'C' && (
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
      {!usesSubitems && (
        <div>
          <ExpenseField label="Descripción" error={fieldErrors.description}>
            <textarea className="w-full bg-transparent outline-none font-inter text-sm resize-none" style={{color: COLORS.text}} rows={4} maxLength={1000} disabled={saved}
              placeholder="Detalle el motivo del gasto..." value={description} onChange={(event) => handleDescriptionChange(event.target.value)} />
          </ExpenseField>
          <p className={styles.charCount} style={{color: COLORS.labels}}>{description.length}/1000</p>
        </div>
      )}
      <CategorySelector categories={categories} categoryId={categoryId} onChange={handleCategoryChange} error={fieldErrors.category} />
      <ReceiptUpload previewImage={imagePreview} onChange={handleImageChange} onRemove={handleRemoveImage} error={fieldErrors.image} />
    </>
  );
}

export default ExpenseEditForm;