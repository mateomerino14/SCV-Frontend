import {useState} from 'react';
import {takeExpenseReview} from '../../services/approval/reviewService';
import useReviewInbox from './useReviewInbox';
import useTakeInbox from './useTakeInbox';

function useSupervisorPendingExpenseReviews() {
  const [actionError, setActionError] = useState('');
  const {counts, error, tab, setTab, clearFilters, ...inbox} = useReviewInbox('jefe-rendiciones-pendientes', 'TODOS');
  const take = useTakeInbox(takeExpenseReview, inbox.reload, setActionError);
  return {
    ...inbox,
    ...take,
    total: counts.TODOS || 0,
    error: actionError || error,
    statusFilter: tab,
    setStatusFilter: setTab,
    clearFilters: () => {
      clearFilters();
      setTab('TODOS');
    },
  };
}

export default useSupervisorPendingExpenseReviews;
