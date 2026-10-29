import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {ArrowLeft, Calendar, DollarSign, Tag, FileText, User, Receipt, List, Globe, ArrowLeftRight, Image as ImageIcon} from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import DynamicMenu from '../../layouts/menu/DynamicMenu';
import ReceiptSentModal from '../../features/expense/organisms/ReceiptSentModal';
import ReceiptSendingModal from '../../features/expense/organisms/ReceiptSendingModal';
import ExpenseHeaderCard from '../../features/expense/molecules/ExpenseHeaderCard';
import ExpenseSectionCard from '../../features/expense/molecules/ExpenseSectionCard';
import ExpenseFieldRow from '../../features/expense/atoms/ExpenseFieldRow';
import {formatQuantity, formatUnitPrice} from '../../utils/formatQuantity';
import {calculateInvoiceVat} from '../../utils/invoiceAmounts';
import ExpenseDataTable from '../../features/expense/molecules/ExpenseDataTable';
import ExpenseWithholdingsCard from '../../features/expense/organisms/ExpenseWithholdingsCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SessionExpiredModal from '../../features/user/organisms/SessionExpiredModal';
import useExpenseDetail from '../hooks/useExpenseDetail';
import useMenu from '../../hooks/shared/useMenu';
import {COLORS} from '../../constants';
import {routes, tripPath} from '../../constants/routes';
import {formatReceiptNumber} from '../../utils/documentNumber';
import {getExpenseWithholdings, roundCents} from '../../utils/withholdings';
import {usdCurrency, savedBsRateOf, hasOriginCurrencyLines, conversionLabelOf} from '../../utils/expenseCurrency';

const imageMaxHeight = 720;

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-6 w-fit",
  imageWrapper: "rounded-xl overflow-hidden border mt-2",
  image: "w-full object-contain",
  imageHint: "text-[11px] font-inter text-center py-1.5",
};

const typeConfig = {
  F: {label: 'Factura', bg: COLORS.positionRole, color: COLORS.accentBlue},
  R: {label: 'Recibo', bg: COLORS.travelTypes, color: COLORS.travelTypesText},
  C: {label: 'Compra', bg: COLORS.successLight, color: COLORS.successStrong},
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
  const backups = expense.Imagen_Respaldo || [];
  const systemReceipt = (expense.Recibo || [])[0];
  const receiptRequired = expense.Categoria_Gasto?.requiere_comprobante !== false;
  const isInternational = !!expense.es_gasto_internacional;
  let currency = 'Bs';
  if (isInternational) {
    currency = 'USD';
  }
  const installments = expense.Gasto_Tramo_Moneda || [];
  const bsRate = savedBsRateOf(expense);
  const hasRates = isInternational && bsRate > 0;
  const hasInstallments = isInternational && !hasRates && installments.length > 0;
  let conversionLabel = null;
  if (isInternational && installments.length > 0) {
    conversionLabel = conversionLabelOf(installments);
  }
  let subitemCurrency = currency;
  if (hasOriginCurrencyLines(expense)) {
    subitemCurrency = expense.moneda;
  }
  const subitems = expense.Gasto_Subitem || [];
  const hasSubitems = subitems.length > 0;
  let backRoute = location.state?.from || routes.employeeDashboard;
  if (!location.state?.from && expense.id_viaje) {
    backRoute = tripPath(expense.id_viaje);
  }
  const originPath = location.state?.from || '';
  const isReviewContext = originPath.includes('/supervisor/') || originPath.includes('/revisor/') || originPath.includes('/aprobador/');
  const canGenerateReceipt = (expense.tipo === 'C' || expense.tipo === 'S') && !isReviewContext && expense.Viaje?.estado === 'APROBADO_FINAL';
  const expenseWithholdings = getExpenseWithholdings(expense);
  const hasWithholdings = expenseWithholdings.rcIva > 0 || expenseWithholdings.iue > 0 || expenseWithholdings.it > 0;
  let vat = null;
  if (hasInvoice && expense.tipo === 'F') {
    const invoiceVat = calculateInvoiceVat(expense.monto_total);
    if (invoiceVat > 0) {
      vat = invoiceVat;
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
          conversionLabel={conversionLabel}
          hasSubitems={hasSubitems} subitemsCount={subitems.length}
          canGenerateReceipt={canGenerateReceipt} sending={sending} onSendReceipt={handleSendReceipt} />
        <ExpenseSectionCard icon={Calendar} title="Información General">
          <ExpenseFieldRow icon={Calendar} label="Fecha del Gasto" value={formatLongDate(expense.fecha_gasto)} />
          {expense.Categoria_Gasto && <ExpenseFieldRow icon={Tag} label="Categoría" value={expense.Categoria_Gasto.nombre} />}
          {expense.Proveedor && <ExpenseFieldRow icon={User} label="Proveedor" value={expense.Proveedor.nombre} />}
          {expense.numero_recibo && <ExpenseFieldRow icon={FileText} label="N° de Recibo original (va en la planilla y en Oracle)" value={expense.numero_recibo} />}
          {systemReceipt && expense.numero_recibo && <ExpenseFieldRow icon={FileText} label="N° de Recibo del sistema" value={formatReceiptNumber(systemReceipt.numero, systemReceipt.periodo)} />}
          {systemReceipt && !expense.numero_recibo && (
            <ExpenseFieldRow icon={FileText} label="N° de Recibo del sistema (no tiene recibo original)" value={formatReceiptNumber(systemReceipt.numero, systemReceipt.periodo)}
              iconBg={COLORS.systemReceipt} iconColor={COLORS.systemReceiptText} valueColor={COLORS.systemReceiptText} />
          )}
          {expense.Proveedor?.numero_doc_fiscal && (
            <ExpenseFieldRow icon={FileText} label={expense.Proveedor.tipo_doc_fiscal || 'Documento'} value={expense.Proveedor.numero_doc_fiscal} />
          )}
          {hasImage && <ExpenseFieldRow icon={ImageIcon} label="Comprobante" value="Adjunto (ver abajo)" last />}
          {!hasImage && !receiptRequired && <ExpenseFieldRow icon={ImageIcon} label="Comprobante" value="No requerido para esta categoría" last />}
          {!hasImage && receiptRequired && (
            <ExpenseFieldRow icon={ImageIcon} label="Comprobante" value="Sin comprobante adjunto" last iconBg={COLORS.error} iconColor={COLORS.secondary} valueColor={COLORS.secondary} />
          )}
        </ExpenseSectionCard>
        {hasSubitems && (
          <ExpenseSectionCard icon={List} title="Detalle de Subgastos">
            <ExpenseDataTable columns={['Descripción', 'Monto']} gridTemplate="2fr 1fr" headerBg={COLORS.title}
              rows={subitems} totalValue={`${subitems.reduce((sum, subitem) => sum + parseFloat(subitem.monto || 0), 0).toFixed(2)} ${subitemCurrency}`}
              renderRow={(subitem) => (
                <>
                  <span className="px-2 text-left" style={{color: COLORS.text}}>{subitem.descripcion}</span>
                  <span style={{color: COLORS.title, fontWeight: 'bold'}}>{parseFloat(subitem.monto).toFixed(2)} {subitemCurrency}</span>
                </>
              )} />
          </ExpenseSectionCard>
        )}
        {hasRates && (
          <ExpenseSectionCard icon={Globe} title="Cambio de Moneda">
            <ExpenseFieldRow icon={DollarSign} label={`Monto en ${expense.moneda}`} value={`${parseFloat(expense.monto_moneda_origen).toFixed(2)} ${expense.moneda}`} />
            {expense.moneda !== usdCurrency && (
              <ExpenseFieldRow icon={ArrowLeftRight} label="Tipo de cambio a dólares" value={`1 USD = ${parseFloat(expense.tipo_cambio).toFixed(4)} ${expense.moneda}`} />
            )}
            <ExpenseFieldRow icon={DollarSign} label="Equivalente en USD" value={`${parseFloat(expense.monto_total).toFixed(2)} USD`} />
            <ExpenseFieldRow icon={ArrowLeftRight} label="Tipo de cambio a bolivianos" value={`1 USD = ${bsRate.toFixed(4)} Bs`} />
            <ExpenseFieldRow icon={DollarSign} label="Equivalente en Bs" value={`${roundCents(parseFloat(expense.monto_total) * bsRate).toFixed(2)} Bs`} last />
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
            <ExpenseFieldRow icon={FileText} label="Número de Factura / Código" value={expense.Factura.numero_factura} />
            {expense.Factura.cuf && <ExpenseFieldRow icon={FileText} label="CUF / Código de Autorización" value={expense.Factura.cuf} />}
            <ExpenseFieldRow icon={Calendar} label="Fecha de Emisión" value={formatLongDate(expense.Factura.fecha_emision)} />
            <ExpenseFieldRow icon={DollarSign} label="Monto sin impuestos" value={`${(parseFloat(expense.monto_total || 0) - (vat || 0)).toFixed(2)} ${currency}`}
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
                      <span style={{color: COLORS.text}}>{formatQuantity(detail.cantidad)}</span>
                      <span style={{color: COLORS.title, fontWeight: 'bold'}}>{formatUnitPrice(detail.precio)} {currency}</span>
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
              <a href={expense.Imagen.url_archivo} target="_blank" rel="noreferrer" className="block" title="Abrir en tamaño completo">
                <img src={expense.Imagen.url_archivo} alt="comprobante" className={styles.image} style={{maxHeight: imageMaxHeight, backgroundColor: COLORS.backgroundHeader}} />
              </a>
              <p className={styles.imageHint} style={{color: COLORS.labels, backgroundColor: COLORS.backgroundHeader}}>Toca la imagen para verla en tamaño completo</p>
            </div>
          </ExpenseSectionCard>
        )}
        {backups.length > 0 && (
          <ExpenseSectionCard icon={FileText} title="Respaldos">
            {backups.map((backup, index) => (
              <div key={backup.id_respaldo} className={styles.imageWrapper} style={{borderColor: COLORS.dataFields}}>
                <a href={backup.url_archivo} target="_blank" rel="noreferrer" className="block" title="Abrir en tamaño completo">
                  <img src={backup.url_archivo} alt={`respaldo ${index + 1}`} className={styles.image} style={{maxHeight: imageMaxHeight, backgroundColor: COLORS.backgroundHeader}} />
                </a>
                <p className={styles.imageHint} style={{color: COLORS.labels, backgroundColor: COLORS.backgroundHeader}}>Toca la imagen para verla en tamaño completo</p>
              </div>
            ))}
          </ExpenseSectionCard>
        )}
      </div>
      <ReceiptSendingModal isOpen={sending} />
      <ReceiptSentModal isOpen={receiptModal.show} onClose={closeReceiptModal} success={receiptModal.success} message={receiptModal.message} />
      <Footer />
    </div>
  );
}

export default ExpenseDetailPage;