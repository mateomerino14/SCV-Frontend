import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, AlertTriangle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import PageHeader from '../../components/ui/PageHeader';
import InvoiceDropZone from '../../features/expense/organisms/InvoiceDropZone';
import InvoicePreviewItem from '../../features/expense/organisms/InvoicePreviewItem';
import InvoiceExpandedContent from '../../features/expense/organisms/InvoiceExpandedContent';
import ReadingTip from '../../features/expense/atoms/ReadingTip';
import DeleteInvoiceConfirmModal from '../../features/expense/organisms/DeleteInvoiceConfirmModal';
import DeadlineRequestModal from '../../features/approval/organisms/DeadlineRequestModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useUploadInvoice from '../../hooks/expense/useUploadInvoice';
import useDeadlineAuthorization from '../../hooks/approval/useDeadlineAuthorization';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {tripPath} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  card: "rounded-2xl shadow-md p-5 mb-4",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-3",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  solicitudBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 flex items-center justify-center gap-2",
};

function UploadInvoicePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fechaFin = location.state?.fechaFin;
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    invoices, categories, expandedIndex, savingAll, error, saveSummary, showDeleteModal,
    hasRequiresAuthorization, allSaved,
    handleAddFiles, handleAddManual, handleSelectInvoice, handleRequestDelete, handleConfirmDelete, handleCancelDelete,
    handleFieldChange, handleManualImageChange, handleAddDetail, handleRemoveDetail, handleSave,
  } = useUploadInvoice(id);
  const {isPending, isRejected, canRequest, showModal: showDeadlineModal, setShowModal: setShowDeadlineModal, submitting: submittingDeadline, error: deadlineError, handleRequest} = useDeadlineAuthorization(id, fechaFin);
  const pendingCount = invoices.filter((invoice) => invoice.data && !invoice.loading && !invoice.saved).length;

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Subir Factura" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(tripPath(id))}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <PageHeader title="Subir Factura" subtitle="Registra un gasto a partir de una factura escaneada." />
        {isPending && (
          <p className="text-sm font-bold font-inter text-center py-2 px-3 rounded-xl mt-2 mb-4" style={{backgroundColor: '#ffd700aa', color: '#7a5900'}}>
            Tienes una solicitud de autorización de plazo pendiente de revisión.
          </p>
        )}
        <ReadingTip />
        <InvoiceDropZone onFiles={handleAddFiles} onManual={handleAddManual} />
        {invoices.length > 0 && (
          <div className={styles.card} style={{backgroundColor: COLORS.background}}>
            <p className={styles.sectionTitle} style={{color: COLORS.labels}}>Facturas Cargadas</p>
            {invoices.map((invoice, index) => (
              <InvoicePreviewItem key={index} invoice={invoice} index={index} expanded={expandedIndex === index}
                onSelect={handleSelectInvoice} onRemove={handleRequestDelete}>
                {invoice.loading && <p className="text-xs font-inter text-center py-4" style={{color: COLORS.labels}}>Extrayendo datos de la factura...</p>}
                {invoice.error && <p className="text-xs font-inter italic text-center py-2" style={{color: COLORS.secondary}}>{invoice.error}</p>}
                {invoice.data && (
                  <InvoiceExpandedContent invoice={invoice} index={index} categories={categories}
                    onFieldChange={handleFieldChange} onImageChange={handleManualImageChange}
                    onAddDetail={handleAddDetail} onRemoveDetail={handleRemoveDetail} />
                )}
              </InvoicePreviewItem>
            ))}
          </div>
        )}
        {saveSummary && (
          <div className="rounded-2xl px-4 py-3 mt-3 mb-3 text-center" style={{backgroundColor: saveSummary.failed > 0 ? '#fef3cd' : '#d4edda'}}>
            <p className="text-sm font-bold font-inter" style={{color: saveSummary.failed > 0 ? '#856404' : '#155724'}}>
              {saveSummary.saved} factura{saveSummary.saved !== 1 ? 's' : ''} guardada{saveSummary.saved !== 1 ? 's' : ''} correctamente
            </p>
            {saveSummary.failed > 0 && (
              <p className="text-xs font-inter mt-1" style={{color: '#856404'}}>
                {saveSummary.failed} factura{saveSummary.failed !== 1 ? 's' : ''} con error — revisa las tarjetas marcadas
              </p>
            )}
          </div>
        )}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
        {hasRequiresAuthorization && canRequest && !isPending && (
          <button className={styles.solicitudBtn} style={{backgroundColor: COLORS.secondary, color: COLORS.background}} onClick={() => setShowDeadlineModal(true)}>
            <AlertTriangle size={16} />
            Solicitar Autorización al Revisor
          </button>
        )}
        {isRejected && (
          <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>
            Tu solicitud de autorización de plazo anterior fue rechazada.
          </p>
        )}
        {pendingCount > 0 && (
          <button className={styles.guardarBtn} style={{backgroundColor: savingAll ? COLORS.fields : COLORS.primary}} onClick={handleSave} disabled={savingAll}>
            {savingAll ? 'Guardando...' : `Guardar ${pendingCount} factura${pendingCount !== 1 ? 's' : ''}`}
          </button>
        )}
        <button className={styles.cancelarBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => navigate(tripPath(id))}>
          {allSaved ? 'Volver al Viaje' : 'Cancelar'}
        </button>
      </div>
      <DeleteInvoiceConfirmModal isOpen={showDeleteModal} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} />
      <DeadlineRequestModal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} onConfirm={handleRequest} loading={submittingDeadline} error={deadlineError} />
      <Footer />
    </div>
  );
}

export default UploadInvoicePage;