import {COLORS} from '../../../constants';
import InvoiceImagePreview from '../atoms/InvoiceImagePreview';
import InvoiceForm from './InvoiceForm';
import InvoiceDetailPanel from './InvoiceDetailPanel';

const styles = {
  desktopGrid: 'hidden md:grid md:grid-cols-3 gap-4 mt-3 items-stretch',
  mobileStack: 'md:hidden mt-3 flex flex-col gap-4',
  colWrapper: 'flex flex-col h-full',
  imageBox: 'flex flex-col h-full shadow-md rounded-lg p-5 py-7',
  manualImageLabel: 'text-sm font-bold font-inter uppercase mb-3',
  manualImageBtn: 'w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border flex items-center justify-center gap-2 mt-2 block text-center',
  manualImageError: 'text-xs font-inter mt-1',
};

function ManualImageSection({invoice, index, onImageChange, error}) {
  const handleChange = (event) => {
    if (event.target.files[0]) {
      onImageChange(event.target.files[0], index);
      event.target.value = '';
    }
  };
  return (
    <div className={styles.imageBox} style={{backgroundColor: COLORS.background}}>
      <p className={styles.manualImageLabel} style={{color: COLORS.labels}}>
        Comprobante <span style={{color: COLORS.secondary}}>*</span>
      </p>
      <div style={{borderColor: error ? '#ef4444' : COLORS.dataFields, borderWidth: 1, borderStyle: 'solid', borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.backgroundHeader, flex: 1}}>
        <img src={invoice.preview || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRh2G9ljcdizU4yHbZjI_JCm0GWCGJBcPgt39YIhrpew&s=10'}
          alt="comprobante" style={{width: '100%', objectFit: 'cover', maxHeight: invoice.preview ? 710 : 200, opacity: invoice.preview ? 1 : 0.5}} />
      </div>
      <label className={styles.manualImageBtn} style={{borderColor: error ? '#ef4444' : COLORS.primary, color: error ? '#ef4444' : COLORS.primary, cursor: 'pointer'}}>
        {invoice.preview ? 'Cambiar imagen' : 'Subir comprobante'}
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleChange} />
      </label>
      {error && <p className={styles.manualImageError} style={{color: '#ef4444'}}>{error}</p>}
    </div>
  );
}

function AutoImageSection({invoice}) {
  return (
    <div className={styles.imageBox} style={{backgroundColor: COLORS.background}}>
      <InvoiceImagePreview invoice={invoice} />
    </div>
  );
}

function InvoiceExpandedContent({invoice, index, onFieldChange, onImageChange, onAddDetail, onRemoveDetail, categories}) {
  const imageSection = invoice.manual
    ? <ManualImageSection invoice={invoice} index={index} onImageChange={onImageChange} error={invoice.fieldErrors?.image} />
    : <AutoImageSection invoice={invoice} />;
  return (
    <>
      <div className={styles.desktopGrid}>
        {imageSection}
        <div className={styles.colWrapper}>
          <InvoiceForm data={invoice.data} onChange={(field, value, silent) => onFieldChange(index, field, value, silent)}
            manuallyModified={invoice.manuallyModified} fieldErrors={invoice.fieldErrors} saved={invoice.saved} categories={categories} />
        </div>
        <div className={styles.colWrapper}>
          <InvoiceDetailPanel detail={invoice.data.detalle || []} onAdd={(item) => onAddDetail(index, item)}
            onRemove={(detailIndex) => onRemoveDetail(index, detailIndex)} saved={invoice.saved} />
        </div>
      </div>
      <div className={styles.mobileStack}>
        {imageSection}
        <InvoiceForm data={invoice.data} onChange={(field, value, silent) => onFieldChange(index, field, value, silent)}
          manuallyModified={invoice.manuallyModified} fieldErrors={invoice.fieldErrors} saved={invoice.saved} categories={categories} />
        <InvoiceDetailPanel detail={invoice.data.detalle || []} onAdd={(item) => onAddDetail(index, item)}
          onRemove={(detailIndex) => onRemoveDetail(index, detailIndex)} saved={invoice.saved} />
      </div>
    </>
  );
}

export default InvoiceExpandedContent;