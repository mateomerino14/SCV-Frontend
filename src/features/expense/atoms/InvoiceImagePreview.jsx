import {COLORS} from '../../../constants';

const styles = {
  wrapper: "rounded-xl overflow-hidden shadow-md max-h-200",
  footer: "p-3 flex flex-col justify-between items-start",
  metaLabel: "text-xs font-inter pl-2",
  metaValue: "text-sm font-bold font-inter pl-2",
  imageHint: "text-[11px] font-inter text-center py-1.5",
};

function InvoiceImagePreview({invoice}) {
  const amount = parseFloat(invoice.data.monto || 0);
  const vat = parseFloat(invoice.data.iva || 0);
  const totalAmount = (amount + vat).toFixed(2);
  const invoiceName = `${invoice.data.proveedor} — ${totalAmount} Bs`;

  return (
    <div className={styles.wrapper}>
      <a href={invoice.preview} target="_blank" rel="noreferrer" className="block" title="Abrir en tamaño completo">
        <img src={invoice.preview} alt="factura" className="w-full object-contain" style={{maxHeight: '710px', backgroundColor: COLORS.backgroundHeader}} />
      </a>
      <p className={styles.imageHint} style={{color: COLORS.labels, backgroundColor: COLORS.backgroundHeader}}>Toca la imagen para verla en tamaño completo</p>
      <div className={styles.footer} style={{backgroundColor: COLORS.backgroundHeader}}>
        <div className="text-left">
          <p className={styles.metaLabel} style={{color: COLORS.labels}}>Vista Previa</p>
          <p className={styles.metaValue} style={{color: COLORS.text}}>{invoiceName}</p>
        </div>
        <div className="text-left">
          <p className={styles.metaLabel} style={{color: COLORS.labels}}>Fecha detectada</p>
          <p className={styles.metaValue} style={{color: COLORS.text}}>{invoice.data.fecha_emision}</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceImagePreview;