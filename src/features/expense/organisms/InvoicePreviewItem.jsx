import {Trash2, ChevronDown, ChevronUp, QrCode} from 'lucide-react';
import {COLORS} from '../../../constants';
import useInvoicePreviewStatus from '../hooks/useInvoicePreviewStatus';

const placeholderInvoice = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRh2G9ljcdizU4yHbZjI_JCm0GWCGJBcPgt39YIhrpew&s=10";

const styles = {
  container: "rounded-xl border mb-2 overflow-hidden",
  header: "flex items-center justify-between p-3 cursor-pointer",
  left: "flex items-center gap-3",
  name: "text-sm font-bold font-inter",
  status: "text-xs font-inter flex items-center gap-1",
  saveError: "text-xs font-inter font-bold mt-1",
  preview: "w-12 h-12 rounded-lg object-cover border",
  expanded: "px-3 pb-3",
};

function InvoicePreviewItem({invoice, index, expanded, onSelect, onRemove, children}) {
  const {getStatusColor, getStatusText, getBorderColor} = useInvoicePreviewStatus(invoice);
  const amount = parseFloat(invoice.data?.monto || 0);
  const vat = parseFloat(invoice.data?.iva || 0);
  const totalAmount = (amount + vat).toFixed(2);
  let displayName = invoice.name;
  if (invoice.data) {
    displayName = `${invoice.data.proveedor || 'Sin proveedor'} — ${totalAmount} Bs`;
  }

  return (
    <div className={styles.container} style={{borderColor: getBorderColor(expanded), backgroundColor: expanded ? COLORS.backgroundHeader : 'transparent'}}>
      <div className={styles.header} onClick={() => onSelect(index)}>
        <div className={styles.left}>
          <img src={invoice.preview || placeholderInvoice} alt="factura" className={styles.preview} style={{opacity: invoice.preview ? 1 : 0.5}} />
          <div>
            <p className={styles.name} style={{color: COLORS.text}}>{displayName}</p>
            <p className={styles.status} style={{color: getStatusColor()}}>
              {invoice.data?.extraido_por_qr && !invoice.saved && <QrCode size={11} />}
              {getStatusText()}
            </p>
            {invoice.saveError && <p className={styles.saveError} style={{color: COLORS.secondary}}>{invoice.saveError}</p>}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {expanded ? <ChevronUp size={18} style={{color: COLORS.labels}} /> : <ChevronDown size={18} style={{color: COLORS.labels}} />}
          <Trash2 size={18} style={{color: COLORS.secondary, cursor: 'pointer'}} onClick={(event) => {event.stopPropagation(); onRemove(index);}} />
        </div>
      </div>
      {expanded && children && (
        <div className={styles.expanded} style={{backgroundColor: COLORS.background}}>{children}</div>
      )}
    </div>
  );
}

export default InvoicePreviewItem;