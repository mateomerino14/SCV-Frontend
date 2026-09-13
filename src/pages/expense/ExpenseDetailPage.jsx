import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, Calendar, DollarSign, Tag, FileText, User, Receipt, List, Globe} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ReceiptSentModal from '../../features/expense/organisms/ReceiptSentModal';
import ExpenseHeaderCard from '../../features/expense/molecules/ExpenseHeaderCard';
import ExpenseSectionCard from '../../features/expense/molecules/ExpenseSectionCard';
import ExpenseFieldRow from '../../features/expense/atoms/ExpenseFieldRow';
import ExpenseDataTable from '../../features/expense/molecules/ExpenseDataTable';
import ExpenseWithholdingsCard from '../../features/expense/organisms/ExpenseWithholdingsCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useExpenseDetail from '../hooks/useExpenseDetail';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {tripPath} from '../../constants/routes';

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-6 w-fit",
  imageWrapper: "rounded-xl overflow-hidden border mt-2",
  image: "w-full object-contain",
};

const typeConfig = {
  F: {label: 'Factura', bg: COLORS.positionRole, color: '#3b4fd4'},
  R: {label: 'Recibo', bg: COLORS.travelTypes, color: COLORS.travelTypesText},
  C: {label: 'Compra', bg: '#e6f4ea', color: '#2d7a3a'},
  S: {label: 'Servicio', bg: COLORS.backgroundHeader, color: COLORS.labels},
};

const formatLongDate = (dateStr) => {
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'});
};

function ExpenseDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {menuOpen, user, openMenu, closeMenu, sessionExpired, handleSessionExpiredClose} = useMenu();
  const {expense, loading, error, sending, receiptModal, handleSendReceipt, closeReceiptModal} = useExpenseDetail(id);
  if (loading) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Detalle de Gasto" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className={styles.content}><SkeletonCard lines={6} /></div>
        <Footer />
      </div>
    );
  }
  if (error || !expense) {
    return (
      <div className={styles.page} style={{backgroundColor: COLORS.background}}>
        <Navbar text="Detalle de Gasto" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
        <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
        <div className="flex-1 flex items-center justify-center"><p style={{color: COLORS.secondary}}>{error || 'No se encontró el gasto'}</p></div>
        <Footer />
      </div>
    );
  }

  const typeInfo = typeConfig[expense.tipo] || typeConfig.S;
  const hasInvoice = !!expense.Factura;
  const hasImage = expense.Imagen && expense.Imagen.url_archivo;
  const isInternational = !!expense.es_gasto_internacional;
  const currency = isInternational ? 'USD' : 'Bs';
  const installments = expense.Gasto_Tramo_Moneda || [];
  const hasInstallments = isInternational && installments.length > 0;
  const subitems = expense.Gasto_Subitem || [];
  const hasSubitems = subitems.length > 0;
  const backRoute = location.state?.from || (expense.id_viaje ? tripPath(expense.id_viaje) : '/dashboard/empleado');
  const originPath = location.state?.from || '';
  const isReviewContext = originPath.includes('/supervisor/') || originPath.includes('/revisor/') || originPath.includes('/aprobador/');
  const canGenerateReceipt = (expense.tipo === 'C' || expense.tipo === 'S') && !isReviewContext && expense.Viaje?.estado === 'APROBADO_FINAL';
  const hasWithholdings = !isInternational && (expense.tipo === 'C' || expense.tipo === 'S') && (parseFloat(expense.retencion_rc_iva || 0) > 0 || parseFloat(expense.retencion_iue || 0) > 0 || parseFloat(expense.retencion_it || 0) > 0);
  let vat = null;
  if (hasInvoice) {
    const taxRecords = expense.Factura.Factura_Impuestos || [];
    if (taxRecords.length > 0) {
      const partial = parseFloat(expense.Factura.monto_parcial || 0);
      vat = taxRecords.reduce((sum, record) => {
        const percentage = parseFloat(record.Impuesto?.porcentaje || 0);
        return sum + (partial * percentage / 100);
      }, 0);
      if (vat <= 0) {
        vat = null;
      }
    }
    else {
      const partial = parseFloat(expense.Factura.monto_parcial || 0);
      const total = parseFloat(expense.monto_total || 0);
      const calculated = total - partial;
      if (calculated > 0) {
        vat = calculated;
      }
    }
  }

  return (
    <div className={styles.page} style={{backgroundColor: COLORS.background}}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalle de Gasto" onMenuClick={openMenu} profilePhoto={user?.foto_perfil} />
      <DynamicMenu isOpen={menuOpen} onClose={closeMenu} user={user} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(backRoute)}>
          <ArrowLeft size={25} style={{color: COLORS.title}} />
        </button>
        <ExpenseHeaderCard expense={expense} typeLabel={typeInfo.label} isInternational={isInternational} currency={currency}
          hasInstallments={hasInstallments} installmentsCount={installments.length}
          hasSubitems={hasSubitems} subitemsCount={subitems.length}
          canGenerateReceipt={canGenerateReceipt} sending={sending} onSendReceipt={handleSendReceipt} />
        <ExpenseSectionCard icon={Calendar} title="Información General">
          <ExpenseFieldRow icon={Calendar} label="Fecha del Gasto" value={formatLongDate(expense.fecha_gasto)} />
          {expense.Categoria_Gasto && <ExpenseFieldRow icon={Tag} label="Categoría" value={expense.Categoria_Gasto.nombre} />}
          {expense.Proveedor && <ExpenseFieldRow icon={User} label="Proveedor" value={expense.Proveedor.nombre} />}
          {expense.Proveedor?.numero_doc_fiscal ? (
            <ExpenseFieldRow icon={FileText} label={expense.Proveedor.tipo_doc_fiscal || 'Documento'} value={expense.Proveedor.numero_doc_fiscal} last={!hasInvoice} />
          ) : (
            <ExpenseFieldRow icon={FileText} label="Comprobante" value="Sin Comprobante" last iconBg={COLORS.error} iconColor={COLORS.secondary} valueColor={COLORS.secondary} />
          )}
        </ExpenseSectionCard>
        {hasSubitems && (
          <ExpenseSectionCard icon={List} title="Detalle de Subgastos">
            <ExpenseDataTable columns={['Descripción', 'Monto']} gridTemplate="2fr 1fr" headerBg={COLORS.title}
              rows={subitems} totalValue={`${subitems.reduce((sum, subitem) => sum + parseFloat(subitem.monto || 0), 0).toFixed(2)} ${currency}`}
              renderRow={(subitem) => (
                <>
                  <span className="px-2 text-left" style={{color: COLORS.text}}>{subitem.descripcion}</span>
                  <span style={{color: COLORS.title, fontWeight: 'bold'}}>{parseFloat(subitem.monto).toFixed(2)} {currency}</span>
                </>
              )} />
          </ExpenseSectionCard>
        )}
        {hasInstallments && (
          <ExpenseSectionCard icon={Globe} title="Tramos de Cambio de Moneda">
            <ExpenseDataTable columns={['Monto Origen', 'Tipo de Cambio', 'Equivalente USD']} gridTemplate="1fr 1fr 1fr" headerBg={COLORS.primary}
              rows={installments} totalValue={`${installments.reduce((sum, installment) => sum + parseFloat(installment.monto_usd || 0), 0).toFixed(2)} USD`}
              renderRow={(installment) => (
                <>
                  <span style={{color: COLORS.text}}>{parseFloat(installment.monto_origen).toFixed(2)} {installment.moneda}</span>
                  <span style={{color: COLORS.labels}}>1 USD = {parseFloat(installment.tipo_cambio).toFixed(4)} {installment.moneda}</span>
                  <span style={{color: COLORS.primary, fontWeight: 'bold'}}>{parseFloat(installment.monto_usd).toFixed(2)} USD</span>
                </>
              )} />
          </ExpenseSectionCard>
        )}
        {hasInvoice && (
          <ExpenseSectionCard icon={Receipt} title="Datos de la Factura">
            <ExpenseFieldRow icon={FileText} label="Número de Factura" value={expense.Factura.numero_factura} />
            <ExpenseFieldRow icon={Calendar} label="Fecha de Emisión" value={formatLongDate(expense.Factura.fecha_emision)} />
            <ExpenseFieldRow icon={DollarSign} label="Monto sin impuestos" value={`${parseFloat(expense.Factura.monto_parcial).toFixed(2)} ${currency}`}
              last={!vat && !(expense.Factura.Detalle_Factura?.length > 0)} />
            {vat && <ExpenseFieldRow icon={DollarSign} label="IVA" value={`${vat.toFixed(2)} ${currency}`} last={!(expense.Factura.Detalle_Factura?.length > 0)} />}
            {expense.Factura.Detalle_Factura?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold font-inter uppercase mb-2" style={{color: COLORS.labels}}>Detalle de Productos</p>
                <ExpenseDataTable columns={['Descripción', 'Cant.', 'Precio']} gridTemplate="2fr 1fr 1fr" headerBg={COLORS.title} scroll
                  rows={expense.Factura.Detalle_Factura} totalValue={`${parseFloat(expense.monto_total).toFixed(2)} ${currency}`}
                  renderRow={(detail) => (
                    <>
                      <span className="px-2 text-left" style={{color: COLORS.text}}>{detail.nombre_producto}</span>
                      <span style={{color: COLORS.text}}>{detail.cantidad}</span>
                      <span style={{color: COLORS.title, fontWeight: 'bold'}}>{parseFloat(detail.precio).toFixed(2)} {currency}</span>
                    </>
                  )} />
              </div>
            )}
          </ExpenseSectionCard>
        )}
        {hasWithholdings && <ExpenseWithholdingsCard expense={expense} />}
        {hasImage && (
          <ExpenseSectionCard icon={FileText} title="Comprobante">
            <div className={styles.imageWrapper} style={{borderColor: COLORS.dataFields}}>
              <img src={expense.Imagen.url_archivo} alt="comprobante" className={styles.image} style={{maxHeight: 450, backgroundColor: COLORS.backgroundHeader}} />
            </div>
          </ExpenseSectionCard>
        )}
      </div>
      <ReceiptSentModal isOpen={receiptModal.show} onClose={closeReceiptModal} success={receiptModal.success} message={receiptModal.message} />
      <Footer />
    </div>
  );
}

export default ExpenseDetailPage;