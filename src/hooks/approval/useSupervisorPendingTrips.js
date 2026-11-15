import {useState} from 'react';
import {takeTripReview} from '../../services/approval/reviewService';
import useReviewInbox from './useReviewInbox';
import useTakeInbox from './useTakeInbox';

function useSupervisorPendingTrips() {
  const [actionError, setActionError] = useState('');
  const {counts, error, ...inbox} = useReviewInbox('jefe-viajes-pendientes', 'TODOS');
  const take = useTakeInbox(takeTripReview, inbox.reload, setActionError);
  return {
    ...inbox,
    ...take,
    total: counts.TODOS || 0,
    error: actionError || error,
  };
}

export default useSupervisorPendingTrips;
