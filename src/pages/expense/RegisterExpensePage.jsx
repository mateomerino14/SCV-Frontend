import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, Plus, AlertTriangle} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ExpenseFormCard from '../../features/expense/organisms/ExpenseFormCard';
import DeadlineRequestModal from '../../features/approval/organisms/DeadlineRequestModal';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useRegisterExpense from '../../hooks/expense/useRegisterExpense';
import useDeadlineAuthorization from '../../hooks/approval/useDeadlineAuthorization';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {tripPath} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  addItemBtn: "w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border flex items-center justify-center gap-2 mb-4",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  solicitudBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 flex items-center justify-center gap-2",
};

function RegisterExpensePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fechaFin = location.state?.fechaFin;
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();

  const {
    items, expandedId, categories, isInternationalExpense, savingAll, error, saveSummary,
    hasRequiresAuthorization, allSaved, pendingToSave, currencies,
    finalAmountOf, withholdingsOf, hasWithholdingsOf,
    handleAddItem, handleDuplicateItem, handleRemoveItem, handleSelectItem,
    handleTypeChange, handleDateChange, handleSupplierChange, handleAmountChange,
    handleDescriptionChange, handleCategoryChange, handleImageChange, handleRemoveImage,
    handleToggleOtherCurrency, handleAddInstallment, handleRemoveInstallment, handleInstallmentCurrencyChange, handleInstallmentAmountChange, handleInstallmentExchangeRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSaveAll,
  } = useRegisterExpense(id);

  const {isPending, isRejected, canRequest, showModal: showDeadlineModal, setShowModal: setShowDeadlineModal, submitting: submittingDeadline, error: deadlineError, handleRequest} = useDeadlineAuthorization(id, fechaFin);

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text={isInternationalExpense ? 'Gasto Internacional' : 'Registro de Gastos'} onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(tripPath(id))}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>

        <p className={styles.planLabel} style={{color: COLORS.title}}>{isInternationalExpense ? 'Gastos fuera de Bolivia' : 'Ingresa los datos de tus gastos'}</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>{isInternationalExpense ? 'Gastos Internacionales' : 'Registro de Gastos'}</h1>

        {isPending && (
          <p className="text-sm font-bold font-inter text-center py-2 px-3 rounded-xl mt-2" style={{backgroundColor: '#ffd700aa', color: '#7a5900'}}>
            Tienes una solicitud de autorización de plazo pendiente de revisión.
          </p>
        )}

        {items.map((item, index) => (
          <ExpenseFormCard key={item.id} item={item} index={index} expanded={expandedId === item.id} onSelect={handleSelectItem}
            onRemove={handleRemoveItem} onDuplicate={handleDuplicateItem} canRemove={items.length > 1} categories={categories}
            isInternationalExpense={isInternationalExpense} currencies={currencies} finalAmount={finalAmountOf(item)} withholdings={withholdingsOf(item)} hasWithholdings={hasWithholdingsOf(item)}
            onTypeChange={handleTypeChange} onDateChange={handleDateChange} onSupplierChange={handleSupplierChange} onAmountChange={handleAmountChange}
            onDescriptionChange={handleDescriptionChange} onCategoryChange={handleCategoryChange} onImageChange={handleImageChange} onRemoveImage={handleRemoveImage}
            onToggleOtherCurrency={handleToggleOtherCurrency} onAddInstallment={handleAddInstallment} onRemoveInstallment={handleRemoveInstallment}
            onInstallmentCurrencyChange={handleInstallmentCurrencyChange} onInstallmentAmountChange={handleInstallmentAmountChange} onInstallmentExchangeRateChange={handleInstallmentExchangeRateChange}
            onToggleSubitems={handleToggleSubitems} onAddSubitem={handleAddSubitem} onRemoveSubitem={handleRemoveSubitem}
            onSubitemDescriptionChange={handleSubitemDescriptionChange} onSubitemAmountChange={handleSubitemAmountChange} />
        ))}

        <button className={styles.addItemBtn} style={{borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: 'transparent'}} onClick={handleAddItem}>
          <Plus size={16} />
          Agregar otro gasto
        </button>

        {saveSummary && (
          <div className="rounded-2xl px-4 py-3 mt-3 mb-3 text-center" style={{backgroundColor: saveSummary.failed > 0 ? '#fef3cd' : '#d4edda'}}>
            <p className="text-sm font-bold font-inter" style={{color: saveSummary.failed > 0 ? '#856404' : '#155724'}}>
              {saveSummary.saved} gasto{saveSummary.saved !== 1 ? 's' : ''} guardado{saveSummary.saved !== 1 ? 's' : ''} correctamente
            </p>
            {saveSummary.failed > 0 && (
              <p className="text-xs font-inter mt-1" style={{color: '#856404'}}>
                {saveSummary.failed} gasto{saveSummary.failed !== 1 ? 's' : ''} con error — revisa las tarjetas marcadas en rojo
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

        {!allSaved && (
          <button className={styles.guardarBtn} style={{backgroundColor: savingAll ? COLORS.fields : COLORS.primary}} onClick={handleSaveAll} disabled={savingAll}>
            {savingAll ? 'Guardando...' : `Guardar ${pendingToSave} gasto${pendingToSave !== 1 ? 's' : ''}`}
          </button>
        )}

        <button className={styles.cancelarBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => navigate(tripPath(id))}>
          {allSaved ? 'Volver al Viaje' : 'Cancelar'}
        </button>
      </div>

      <DeadlineRequestModal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} onConfirm={handleRequest} loading={submittingDeadline} error={deadlineError} />
      <Footer />
    </div>
  );
}

export default RegisterExpensePage;