import {useState} from 'react';
import {sendIndividualReceipt} from '../../../services/expense/expenseService';

// Mensaje de confirmacion: indica el numero y si fue un reenvio del mismo recibo
export function buildReceiptSentMessage(data) {
  const number = data?.numeroRecibo ? ` Nº ${data.numeroRecibo}` : '';
  if (data?.reenvio) {
    return `Se reenvió a tu correo el recibo${number}. Conserva el mismo número que el envío anterior.`;
  }
  return `El recibo${number} fue enviado a tu correo.`;
}

function useExpenseReceipt(expenseId) {
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState({show: false, success: false, message: ''});

  const handleSend = async () => {
    setSending(true);
    const data = await sendIndividualReceipt(expenseId);
    setSending(false);
    if (data.error) {
      setModal({show: true, success: false, message: data.error});
      return;
    }
    setModal({show: true, success: true, message: buildReceiptSentMessage(data)});
  };

  const closeModal = () => setModal({show: false, success: false, message: ''});
  return {sending, modal, handleSend, closeModal};
}

export default useExpenseReceipt;