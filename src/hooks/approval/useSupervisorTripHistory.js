import {useState} from 'react';
import {returnTripReview, getReviewEmployees} from '../../services/approval/reviewService';
import useReviewInbox from './useReviewInbox';

function useSupervisorTripHistory() {
  const [actionError, setActionError] = useState('');
  const {counts, error, tab, setTab, clearFilters, ...inbox} = useReviewInbox('jefe-historial-viajes', 'EN_REVISION_VIAJE', getReviewEmployees);

  const handleReturn = async (tripId) => {
    const data = await returnTripReview(tripId);
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
      setTab('EN_REVISION_VIAJE');
    },
    handleReturn,
  };
}

export default useSupervisorTripHistory;
