import {useState} from 'react';
import {returnExpenseReview, getReviewEmployees} from '../../services/approval/reviewService';
import useReviewInbox from './useReviewInbox';

function useSupervisorExpenseReviewHistory() {
  const [actionError, setActionError] = useState('');
  const {counts, error, tab, setTab, clearFilters, ...inbox} = useReviewInbox('jefe-historial-rendiciones', 'EN_REVISION', getReviewEmployees);

  const handleReturn = async (tripId) => {
    const data = await returnExpenseReview(tripId);
    if (data.error) {
      setActionError(data.error);
      return;
    }
    setActionError('');
    await inbox.reload();
  };

  return {
    ...inbox,
    total: counts[tab] || 0,
    error: actionError || error,
    statusFilter: tab,
    setStatusFilter: setTab,
    clearFilters: () => {
      clearFilters();
      setTab('EN_REVISION');
    },
    handleReturn,
  };
}

export default useSupervisorExpenseReviewHistory;
