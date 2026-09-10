import {useNavigate} from 'react-router-dom';
import {expenseDetailPath, editExpensePath, editInvoicePath} from '../../../constants/routes';

function useExpenseNavigation(tripId, originTrip) {
  const navigate = useNavigate();

  const goToEdit = (expense) => {
    if (expense.es_gasto_internacional) {
      navigate(`${editExpensePath(expense.id_gasto)}?internacional=true`);
      return;
    }
    const hasInvoice = expense.tipo === 'F' || expense.tipo === 'R';
    if (hasInvoice) {
      navigate(editInvoicePath(expense.id_gasto));
    }
    else {
      navigate(editExpensePath(expense.id_gasto));
    }
  };

  const goToDetail = (expenseId) => {
    let fromTrip = '/dashboard/empleado';
    if (tripId) {
      fromTrip = `/dashboard/empleado/viaje/${tripId}`;
    }
    navigate(expenseDetailPath(expenseId), {state: {from: fromTrip, origenViaje: originTrip || '/dashboard/empleado'}});
  };

  return {goToEdit, goToDetail};
}

export default useExpenseNavigation;