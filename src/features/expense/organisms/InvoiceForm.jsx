import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import CategorySelector from '../molecules/CategorySelector';
import useInvoiceForm from '../../../hooks/expense/useInvoiceForm';
import DatePickerInput from '../../../components/ui/DatePickerInput';

const styles = {
  wrapper: "flex flex-col gap-4 mt-4 p-5 shadow-md rounded-lg",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-2",
  toggleRow: "flex gap-2 mb-2",
  toggleBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  label: "text-xs font-bold font-inter uppercase",
  splitRow: "flex justify-between rounded-xl px-4 py-3",
  splitValue: "text-base font-bold font-inter mt-1",
  alert: "flex items-center gap-2 p-2 rounded-xl text-xs font-inter justify-center",
};

const fieldsConfig = [
  {key: 'proveedor', label: 'Proveedor', type: 'text', required: true},
  {key: 'numero_factura', label: 'Número de Factura / Código', type: 'text', required: true},
  {key: 'nit', label: 'NIT / CI', type: 'text', required: false},
  {key: 'cuf', label: 'CUF / Código de Autorización', type: 'text', required: false, invoiceOnly: true},
  {key: 'fecha_emision', label: 'Fecha de Emisión', type: 'date', required: true},
  {key: 'monto_total', label: 'Total de la factura', type: 'text', required: true},
];

function InvoiceForm({data, onChange, manuallyModified, fieldErrors = {}, saved = false, categories = [], lockDate = false}) {
  const {vatPercentage, handleFieldChange, handleDocTypeChange} = useInvoiceForm(data, onChange);
  const isInvoice = data.tipo_doc === 'F';

  return (
    <div className={styles.wrapper}>
      <p className="text-sm font-bold font-inter uppercase mb-3" style={{color: COLORS.labels}}>Formulario de Registro</p>
      <div className="mt-3">
        <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Tipo de Documento</p>
        <div className={styles.toggleRow}>
          {['F', 'R'].map((docType) => (
            <button key={docType} disabled={saved} onClick={() => !saved && handleDocTypeChange(docType)}
              className={styles.toggleBtn}
              style={{backgroundColor: data.tipo_doc === docType ? COLORS.primary : 'transparent', borderColor: data.tipo_doc === docType ? COLORS.primary : COLORS.fields,
              color: data.tipo_doc === docType ? COLORS.background : COLORS.labels, opacity: saved ? 0.6 : 1, cursor: saved ? 'default' : 'pointer'}}>
              {docType === 'F' ? 'Factura (F)' : 'Recibo (R)'}
            </button>
          ))}
        </div>
      </div>
      <CategorySelector categories={categories} categoryId={data.id_categoria_gasto} onChange={(id) => handleFieldChange('id_categoria_gasto', id)}
        error={fieldErrors.id_categoria_gasto} disabled={saved} />
      {fieldsConfig.filter((field) => isInvoice || !field.invoiceOnly).map(({key, label, type, required}) => {
        const isLockedDate = key === 'fecha_emision' && lockDate;
        let fieldLabel = label;
        if (key === 'monto_total' && !isInvoice) {
          fieldLabel = 'Total del recibo';
        }
        return (
          <ExpenseField key={key} label={fieldLabel} required={required} error={fieldErrors[key]}>
            {type === 'date' && (
              <DatePickerInput value={data[key] || ''} disabled={saved || isLockedDate} onChange={(value) => handleFieldChange(key, value)} />
            )}
            {type !== 'date' && <input value={data[key] || ''} type={type} inputMode={key === 'monto_total' ? 'decimal' : 'text'} disabled={saved || isLockedDate}
              className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text, opacity: (saved || isLockedDate) ? 0.6 : 1}}
              onChange={(event) => handleFieldChange(key, event.target.value)} />}
          </ExpenseField>
        );
      })}
      {isInvoice && (
        <div className={styles.splitRow} style={{backgroundColor: COLORS.backgroundHeader}}>
          <div>
            <p className={styles.label} style={{color: COLORS.labels}}>Subtotal (sin IVA)</p>
            <p className={styles.splitValue} style={{color: COLORS.text}}>{parseFloat(data.monto || 0).toFixed(2)} Bs</p>
          </div>
          <div className="text-right">
            <p className={styles.label} style={{color: COLORS.labels}}>IVA ({vatPercentage}%)</p>
            <p className={styles.splitValue} style={{color: COLORS.secondary}}>{parseFloat(data.iva || 0).toFixed(2)} Bs</p>
          </div>
        </div>
      )}
      <p className="text-[11px] font-inter -mt-2" style={{color: COLORS.labels}}>
        {isInvoice ? 'Escribe el total que figura en la factura; el IVA ya está incluido y se separa solo.' : 'El recibo no lleva IVA: el total es lo pagado.'}
      </p>
      {manuallyModified && (
        <div className={styles.alert} style={{backgroundColor: COLORS.warningBackground, color: COLORS.warningText}}>Se han detectado cambios manuales en los datos extraídos</div>
      )}
    </div>
  );
}

export default InvoiceForm;