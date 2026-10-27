import {List} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseTypeToggle from '../atoms/ExpenseTypeToggle';
import ExpenseField from '../atoms/ExpenseField';
import WithholdingSummary from '../molecules/WithholdingSummary';
import CategorySelector from '../molecules/CategorySelector';
import ForeignCurrencyFields from '../molecules/ForeignCurrencyFields';
import ToggleSection from '../molecules/ToggleSection';
import SubitemsEditor from '../molecules/SubitemsEditor';
import {sumSubitems} from '../../../utils/expenseSubitems';
import ReceiptUpload from './ReceiptUpload';
import BackupImagesUpload from '../molecules/BackupImagesUpload';
import DatePickerInput from '../../../components/ui/DatePickerInput';

const styles = {
  charCount: "text-xs font-inter text-right mt-1",
};

function ExpenseEditForm({
  type, date, supplier, receiptNumber, amount, description, categoryId, categories, imagePreview, backups, fieldErrors, saved,
  isInternationalExpense, currency, exchangeRate, bsRate, tripDateRange,
  usesSubitems, subitems, validSubitems, subitemErrors, currencies, withholdings, hasWithholdings, finalAmount,
  handleTypeChange, handleDateChange, handleSupplierChange, handleReceiptNumberChange, handleAmountChange, handleDescriptionChange, handleCategoryChange,
  handleImageChange, handleRemoveImage, handleAddBackup, handleRemoveBackup,
  handleCurrencyChange, handleExchangeRateChange, handleBsRateChange,
  handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
}) {
  const automaticAmount = usesSubitems;
  let amountSuffix = 'Bs';
  if (isInternationalExpense) {
    amountSuffix = currency;
  }
  return (
    <>
      <ExpenseTypeToggle type={type} onChange={(newType) => !saved && handleTypeChange(newType)} />
      <ExpenseField label="Fecha del Gasto" required error={fieldErrors.date}>
        <DatePickerInput value={date} onChange={handleDateChange} disabled={saved} rangeStart={tripDateRange.start} rangeEnd={tripDateRange.end} />
      </ExpenseField>
      <ExpenseField label="Proveedor">
        <input type="text" placeholder="Nombre del proveedor" maxLength={50} disabled={saved}
          className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
          value={supplier} onChange={(event) => handleSupplierChange(event.target.value)} />
      </ExpenseField>
      <ExpenseField label="N° de Recibo">
        <input type="text" placeholder="Número impreso en el recibo, si tiene" maxLength={50} disabled={saved}
          className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
          value={receiptNumber} onChange={(event) => handleReceiptNumberChange(event.target.value)} />
      </ExpenseField>
      {isInternationalExpense && (
        <ForeignCurrencyFields currencies={currencies} currency={currency} exchangeRate={exchangeRate} bsRate={bsRate} amount={finalAmount} errors={fieldErrors} disabled={saved}
          onCurrencyChange={handleCurrencyChange} onExchangeRateChange={handleExchangeRateChange} onBsRateChange={handleBsRateChange} />
      )}
      <ExpenseField label={automaticAmount ? 'Monto (calculado automáticamente)' : 'Monto'} required={!automaticAmount} suffix={amountSuffix} error={fieldErrors.amount}>
        <input type="text" inputMode="decimal" placeholder="0.00" disabled={saved || automaticAmount}
          className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}}
          value={automaticAmount ? finalAmount.toFixed(2) : amount} onChange={(event) => handleAmountChange(event.target.value)} />
      </ExpenseField>
      <ToggleSection active={usesSubitems} disabled={saved} icon={List} label="Subgastos" onToggleActive={handleToggleSubitems}>
        <SubitemsEditor subitems={subitems} errors={subitemErrors} currency={amountSuffix} total={sumSubitems(validSubitems)} disabled={saved}
          onAdd={handleAddSubitem} onRemove={handleRemoveSubitem} onDescriptionChange={handleSubitemDescriptionChange} onAmountChange={handleSubitemAmountChange} />
      </ToggleSection>
      {hasWithholdings && (
        <WithholdingSummary title="Retenciones" type={type} paid={finalAmount} withholdings={withholdings} />
      )}
      {!usesSubitems && (
        <div>
          <ExpenseField label="Descripción" required error={fieldErrors.description}>
            <textarea className="w-full bg-transparent outline-none font-inter text-sm resize-none" style={{color: COLORS.text}} rows={4} maxLength={1000} disabled={saved}
              placeholder="Detalle el motivo del gasto..." value={description} onChange={(event) => handleDescriptionChange(event.target.value)} />
          </ExpenseField>
          <p className={styles.charCount} style={{color: COLORS.labels}}>{description.length}/1000</p>
        </div>
      )}
      <CategorySelector categories={categories} categoryId={categoryId} onChange={handleCategoryChange} error={fieldErrors.category} />
      <ReceiptUpload previewImage={imagePreview} onChange={handleImageChange} onRemove={handleRemoveImage} error={fieldErrors.image}
        required={categories.find((category) => category.id_categoria === categoryId)?.requiere_comprobante !== false} />
      <BackupImagesUpload images={backups} onAdd={handleAddBackup} onRemove={handleRemoveBackup} disabled={saved} allowAdd={isInternationalExpense} />
    </>
  );
}

export default ExpenseEditForm;