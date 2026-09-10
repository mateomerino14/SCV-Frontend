import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ExpenseEditForm from '../../features/expense/organisms/ExpenseEditForm';
import SuccessModal from '../../components/ui/SuccessModal';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useEditExpense from '../../hooks/expense/useEditExpense';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {tripPath, expenseDetailPath} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  card: "rounded-2xl shadow-md p-5 flex flex-col gap-5",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  guardarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  cancelarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-2 border",
};

function EditExpensePage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {
    type, setType, date, supplier, amount, description, categoryId, categories, imagePreview, loading, loadingData,
    error, fieldErrors, saved, tripId, isInternationalExpense, usesOtherCurrency, setUsesOtherCurrency,
    installments, validInstallments, finalAmount, installmentErrors, usesSubitems, subitems, validSubitems, subitemErrors,
    currencies, withholdings, hasWithholdings,
    handleImageChange, handleRemoveImage, handleAmountChange,
    handleAddInstallment, handleRemoveInstallment, handleInstallmentCurrencyChange, handleInstallmentAmountChange, handleInstallmentExchangeRateChange,
    handleToggleSubitems, handleAddSubitem, handleRemoveSubitem, handleSubitemDescriptionChange, handleSubitemAmountChange,
    handleSupplierChange, handleDescriptionChange, handleDateChange, handleCategoryChange, handleSave,
  } = useEditExpense(id);

  if (loadingData) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Editar Gasto" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Editar Gasto" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(tripPath(tripId))}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <p className={styles.planLabel} style={{color: COLORS.title}}>Modificar registro existente</p>
        <h1 className={styles.title} style={{color: COLORS.text}}>Editar Gasto</h1>
        <div className={styles.card} style={{backgroundColor: COLORS.background}}>
          <ExpenseEditForm type={type} date={date} supplier={supplier} amount={amount} description={description} categoryId={categoryId}
            categories={categories} imagePreview={imagePreview} fieldErrors={fieldErrors} saved={saved} isInternationalExpense={isInternationalExpense}
            usesOtherCurrency={usesOtherCurrency} setUsesOtherCurrency={setUsesOtherCurrency} installments={installments} validInstallments={validInstallments}
            installmentErrors={installmentErrors} usesSubitems={usesSubitems} subitems={subitems} validSubitems={validSubitems} subitemErrors={subitemErrors}
            currencies={currencies} withholdings={withholdings} hasWithholdings={hasWithholdings} finalAmount={finalAmount}
            handleTypeChange={setType} handleDateChange={handleDateChange} handleSupplierChange={handleSupplierChange} handleAmountChange={handleAmountChange}
            handleDescriptionChange={handleDescriptionChange} handleCategoryChange={handleCategoryChange}
            handleImageChange={handleImageChange} handleRemoveImage={handleRemoveImage}
            handleAddInstallment={handleAddInstallment} handleRemoveInstallment={handleRemoveInstallment}
            handleInstallmentCurrencyChange={handleInstallmentCurrencyChange} handleInstallmentAmountChange={handleInstallmentAmountChange} handleInstallmentExchangeRateChange={handleInstallmentExchangeRateChange}
            handleToggleSubitems={handleToggleSubitems} handleAddSubitem={handleAddSubitem} handleRemoveSubitem={handleRemoveSubitem}
            handleSubitemDescriptionChange={handleSubitemDescriptionChange} handleSubitemAmountChange={handleSubitemAmountChange} />
          {error && <p className={styles.errorMsg} style={{color: COLORS.secondary, backgroundColor: COLORS.error}}>{error}</p>}
          <button className={styles.guardarBtn} style={{backgroundColor: loading ? COLORS.fields : COLORS.primary}} onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button className={styles.cancelarBtn} style={{borderColor: COLORS.primary, color: COLORS.primary}} onClick={() => navigate(tripPath(tripId))}>
            Cancelar
          </button>
        </div>
      </div>
      <SuccessModal isOpen={saved} title="Gasto Actualizado" message="Los cambios se guardaron correctamente" onAccept={() => navigate(expenseDetailPath(id))} />
      <Footer />
    </div>
  );
}

export default EditExpensePage;