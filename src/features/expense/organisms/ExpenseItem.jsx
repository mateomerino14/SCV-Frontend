import {motion} from 'framer-motion';
import {Trash2, Pencil, Globe, MapPin, Calendar, Tag, FileText, ArrowRight, MessageSquare, List, Receipt} from 'lucide-react';
import {COLORS} from '../../../constants';
import {formatDateShort} from '../../../utils/dateFormatter';
import ExpenseFieldTag from '../atoms/ExpenseFieldTag';
import ExpenseObservationsModal from '../../approval/organisms/ExpenseObservationsModal';
import ReceiptSentModal from './ReceiptSentModal';
import useExpenseReceipt from '../hooks/useExpenseReceipt';
import useExpenseObservations from '../hooks/useExpenseObservations';
import useExpenseNavigation from '../hooks/useExpenseNavigation';

const typeLabels = {F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio'};

function getDocLabel(supplier) {
  if (!supplier?.numero_doc_fiscal) {
    return null;
  }
  if (supplier.tipo_doc_fiscal === 'NIT') {
    return `NIT: ${supplier.numero_doc_fiscal}`;
  }
  if (supplier.tipo_doc_fiscal === 'CI') {
    return `CI: ${supplier.numero_doc_fiscal}`;
  }
  return `Doc: ${supplier.numero_doc_fiscal}`;
}

function ExpenseItem({expense, tripInProgress, isFinalApproved, onDelete, tripId, originTrip, observations = []}) {
  const {sending, modal, handleSend, closeModal} = useExpenseReceipt(expense.id_gasto);
  const {showModal, open, close} = useExpenseObservations();
  const {goToEdit, goToDetail} = useExpenseNavigation(tripId, originTrip);
  const docLabel = getDocLabel(expense.Proveedor);
  const displayName = expense.Proveedor?.nombre || expense.Categoria_Gasto?.nombre || 'Sin proveedor';
  const isInternational = !!expense.es_gasto_internacional;
  const canGenerateReceipt = (expense.tipo === 'C' || expense.tipo === 'S') && isFinalApproved;
  const accentColor = isInternational ? COLORS.primary : COLORS.title;
  const expenseDate = expense.Factura?.fecha_emision || expense.fecha_gasto;
  const subitems = expense.Gasto_Subitem || [];
  const hasSubitems = subitems.length > 0;
  const expenseObservations = observations.filter((observation) => observation.id_gasto === expense.id_gasto);

  return (
    <motion.div style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`, borderLeft: `3px solid ${accentColor}`, borderRadius: 12, marginBottom: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6}}
      whileHover={{boxShadow: '0 6px 16px rgba(0,0,0,0.08)'}} transition={{duration: 0.15}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <p style={{color: COLORS.text, fontWeight: 700, fontSize: 13, fontFamily: 'Inter', flex: 1, marginRight: 8, lineHeight: 1.3}}>{displayName}</p>
        <p style={{color: accentColor, fontWeight: 700, fontSize: 14, fontFamily: 'Inter', whiteSpace: 'nowrap'}}>
          {parseFloat(expense.monto_total).toFixed(2)} {isInternational ? 'USD' : 'Bs'}
        </p>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px 12px'}}>
        {expenseDate && <ExpenseFieldTag icon={Calendar} text={formatDateShort(expenseDate)} color={accentColor} />}
        <ExpenseFieldTag icon={Tag} text={typeLabels[expense.tipo] || expense.tipo} color={accentColor} />
        {expense.Factura?.numero_factura && <ExpenseFieldTag icon={FileText} text={`N° ${expense.Factura.numero_factura}`} color={accentColor} />}
        {docLabel && <span style={{fontSize: 11, color: COLORS.labels, fontFamily: 'Inter'}}>{docLabel}</span>}
      </div>
      {isInternational && (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, fontFamily: 'Inter', backgroundColor: COLORS.primary + '15', color: COLORS.primary, padding: '2px 8px', borderRadius: 6, width: 'fit-content'}}>
          <Globe size={10} />
          {parseFloat(expense.monto_total).toFixed(2)} USD
        </span>
      )}
      {hasSubitems && (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, fontFamily: 'Inter', backgroundColor: COLORS.title + '15', color: COLORS.title, padding: '2px 8px', borderRadius: 6, width: 'fit-content'}}>
          <List size={10} />
          {subitems.length} subgasto{subitems.length !== 1 ? 's' : ''}
        </span>
      )}
      {!hasSubitems && expense.descripcion && (
        <p style={{fontSize: 11, color: COLORS.labels, fontFamily: 'Inter', lineHeight: 1.4}}>{expense.descripcion}</p>
      )}
      {expenseObservations.length > 0 && (
        <button onClick={open} style={{display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, fontFamily: 'Inter', backgroundColor: COLORS.error, color: COLORS.secondary, padding: '4px 9px', borderRadius: 8, width: 'fit-content', cursor: 'pointer', border: 'none'}}>
          <MessageSquare size={12} />
          {expenseObservations.length} Observación{expenseObservations.length !== 1 ? 'es' : ''}
        </button>
      )}
      <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 2}}>
        {canGenerateReceipt && (
          <Receipt size={16} style={{color: COLORS.secondary, cursor: sending ? 'default' : 'pointer'}} onClick={sending ? undefined : handleSend} />
        )}
        {tripInProgress && (
          <>
            <Trash2 size={16} style={{color: COLORS.secondary, cursor: 'pointer'}} onClick={() => onDelete(expense.id_gasto)} />
            <Pencil size={16} style={{color: COLORS.secondary, cursor: 'pointer'}} onClick={() => goToEdit(expense)} />
          </>
        )}
        {!tripInProgress && (
          <span style={{fontSize: 12, fontWeight: 700, fontFamily: 'Inter', color: accentColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3}} onClick={() => goToDetail(expense.id_gasto)}>
            Ver Detalle <ArrowRight size={11} />
          </span>
        )}
      </div>
      <ExpenseObservationsModal isOpen={showModal} onClose={close} expenseName={displayName} observations={expenseObservations}
        canEdit={false} newText="" setNewText={() => {}} onAdd={() => {}} onEdit={() => {}} onDelete={() => {}} loading={false} error={null} />

      <ReceiptSentModal isOpen={modal.show} onClose={closeModal} success={modal.success} message={modal.message} />
    </motion.div>
  );
}

export default ExpenseItem;