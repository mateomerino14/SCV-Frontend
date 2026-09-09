import {useParams, useNavigate} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import InvoiceForm from '../../features/expense/organisms/InvoiceForm';
import InvoiceDetailPanel from '../../features/expense/organisms/InvoiceDetailPanel';
import ReceiptUpload from '../../features/expense/organisms/ReceiptUpload';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useEditInvoice from '../../hooks/expense/useEditInvoice';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {tripPath, expenseDetailPath} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  desktopGrid: "hidden md:grid md:grid-cols-3 gap-4 items-stretch",
  mobileStack: "md:hidden flex flex-col gap-4",
  colWrapper: "flex flex-col h-full",
  imageBox: "flex flex-col h-full shadow-md rounded-lg p-5",
  imageLabel: "text-sm font-bold font-inter uppercase mb-3",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-4",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
};

function EditInvoicePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();

  const {
    data, imagePreview, existingImage, loading, loadingData, error, fieldErrors, saved, manuallyModified, tripId,
    handleFieldChange, handleAddDetail, handleRemoveDetail, handleImageChange, handleRemoveImage, handleSave,
  } = useEditInvoice(id);

  if (loadingData || !data) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Editar Factura" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }

  const imageSection = (
    <div className={styles.imageBox} style={{backgroundColor: COLORS.background}}>
      <p className={styles.imageLabel} style={{color: COLORS.labels}}>Comprobante</p>
      <ReceiptUpload previewImage={imagePreview} onChange={handleImageChange} onRemove={handleRemoveImage} error={fieldErrors.image} />
    </div>
  );

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Editar Factura" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(tripPath(tripId))}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>

        <p className={styles.planLabel} style={{color: COLORS.title}}>Modificar comprobante fiscal</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Editar Factura</h1>

        <div className={styles.desktopGrid}>
          {imageSection}
          <div className={styles.colWrapper}>
            <InvoiceForm data={data} onChange={handleFieldChange} manuallyModified={manuallyModified} fieldErrors={fieldErrors} saved={saved} />
          </div>
          <div className={styles.colWrapper}>
            <InvoiceDetailPanel detail={data.detalle || []} onAdd={handleAddDetail} onRemove={handleRemoveDetail} saved={saved} />
          </div>
        </div>

        <div className={styles.mobileStack}>
          {imageSection}
          <InvoiceForm data={data} onChange={handleFieldChange} manuallyModified={manuallyModified} fieldErrors={fieldErrors} saved={saved} />
          <InvoiceDetailPanel detail={data.detalle || []} onAdd={handleAddDetail} onRemove={handleRemoveDetail} saved={saved} />
        </div>

        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}

        <button className={styles.guardarBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.primary}} onClick={handleSave} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button className={styles.cancelarBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => navigate(tripPath(tripId))}>
          Cancelar
        </button>
      </div>

      <SuccessModal isOpen={saved} title="Factura Actualizada" message="Los cambios se guardaron correctamente" onAccept={() => navigate(expenseDetailPath(id))} />

      <Footer />
    </div>
  );
}

export default EditInvoicePage;