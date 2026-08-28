import {QrCode} from 'lucide-react';
import {COLORS} from '../../../constants';
import ExpenseField from '../atoms/ExpenseField';
import useInvoiceForm from '../../../hooks/expense/useInvoiceForm';

const styles = {
  wrapper: "flex flex-col gap-4 mt-4 p-5 shadow-md rounded-lg",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-2",
  toggleRow: "flex gap-2 mb-2",
  toggleBtn: "flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  fieldWrapper: "flex flex-col gap-1",
  label: "text-xs font-bold font-inter uppercase",
  inputBox: "rounded-xl px-4 py-3 border",
  input: "w-full bg-transparent outline-none font-inter text-sm",
  fieldError: "text-xs font-inter mt-1",
  totalAmountBox: "rounded-xl px-4 py-3 border-2",
  totalAmountText: "text-2xl font-bold font-inter",
  alert: "flex items-center gap-2 p-2 rounded-xl text-xs font-inter justify-center",
  qrBadge: "flex items-center gap-2 p-2 rounded-xl text-xs font-bold font-inter justify-center",
};

const fieldsConfig = [
  {key: 'proveedor', label: 'Proveedor', type: 'text', required: true},
  {key: 'numero_factura', label: 'Número de Factura', type: 'text', required: true},
  {key: 'nit', label: 'NIT / CI', type: 'text', required: false},
  {key: 'fecha_emision', label: 'Fecha de Emisión', type: 'date', required: true},
  {key: 'monto', label: 'Monto', type: 'text', required: true},
];

function InvoiceForm({data, onChange, manuallyModified, fieldErrors = {}, saved = false}) {
  const {totalAmount, vatPercentage, handleFieldChange, handleDocTypeChange} = useInvoiceForm(data, onChange, saved);

  return (
    <div className={styles.wrapper}>
      {data.extraido_por_qr && !manuallyModified && (
        <div className={styles.qrBadge} style={{backgroundColor: '#d4edda', color: '#155724'}}>
          <QrCode size={14} />
          Datos extraídos del QR del SIAT
        </div>
      )}

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

      {fieldsConfig.map(({key, label, type, required}) => (
        <ExpenseField key={key} label={`${label}${!required ? ' (Opcional)' : ''}`} error={fieldErrors[key]}>
          <input value={data[key] || ''} type={type} inputMode={key === 'monto' ? 'decimal' : 'text'} disabled={saved}
            className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text, opacity: saved ? 0.6 : 1}}
            onChange={(event) => handleFieldChange(key, event.target.value)} />
        </ExpenseField>
      ))}

      <ExpenseField label={`IVA ${vatPercentage > 0 ? `(${vatPercentage}%)` : '(No aplica)'}`}>
        <input value={data.iva || '0.00'} readOnly type="text" className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text, cursor: 'default'}} />
      </ExpenseField>

      <div className={styles.fieldWrapper}>
        <p className={styles.label} style={{color: COLORS.labels}}>Monto Total</p>
        <div className={styles.totalAmountBox} style={{borderColor: COLORS.secondary}}>
          <p className={styles.totalAmountText} style={{color: COLORS.secondary}}>{totalAmount.toFixed(2)} Bs</p>
        </div>
      </div>

      {manuallyModified && (
        <div className={styles.alert} style={{backgroundColor: '#fef3cd', color: '#856404'}}>Se han detectado cambios manuales en los datos extraídos</div>
      )}
    </div>
  );
}

export default InvoiceForm;