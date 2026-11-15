import {getReviewerEmployees} from '../../services/approval/reviewerService';
import useReviewInbox from './useReviewInbox';

function useReviewerReviews() {
  const {counts, ...inbox} = useReviewInbox('revisor', 'MIS_PENDIENTES', getReviewerEmployees);
  return {
    ...inbox,
    totalMyPending: counts.MIS_PENDIENTES || 0,
    totalApproved: counts.APROBADOS || 0,
    totalRejected: counts.RECHAZADOS || 0,
  };
}

export default useReviewerReviews;
