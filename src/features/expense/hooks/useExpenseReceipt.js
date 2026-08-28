import {useState} from 'react';
import {sendIndividualReceipt} from '../../../services/expense/expenseService';

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
    setModal({show: true, success: true, message: 'El recibo fue enviado correctamente a tu correo.'});
  };

  const closeModal = () => setModal({show: false, success: false, message: ''});

  return {sending, modal, handleSend, closeModal};
}

export default useExpenseReceipt;