import {useState, useEffect} from 'react';
import {getExpenseDetail, sendIndividualReceipt} from '../../services/expense/expenseService';
import {buildReceiptSentMessage} from '../../features/expense/hooks/useExpenseReceipt';

function useExpenseDetail(expenseId) {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [receiptModal, setReceiptModal] = useState({show: false, success: false, message: ''});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getExpenseDetail(expenseId);
      setLoading(false);
      if (data.error) {
        setError(data.error);
        return;
      }
      setExpense(data);
    };
    load();
  }, [expenseId]);

  const handleSendReceipt = async () => {
    setSending(true);
    const data = await sendIndividualReceipt(expenseId);
    setSending(false);
    if (data.error) {
      setReceiptModal({show: true, success: false, message: data.error});
      return;
    }
    setReceiptModal({show: true, success: true, message: buildReceiptSentMessage(data)});
  };

  const closeReceiptModal = () => setReceiptModal({show: false, success: false, message: ''});
  return {expense, loading, error, sending, receiptModal, handleSendReceipt, closeReceiptModal};
}

export default useExpenseDetail;