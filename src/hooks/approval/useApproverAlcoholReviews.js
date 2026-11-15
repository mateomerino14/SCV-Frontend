import useReviewInbox from './useReviewInbox';

function useApproverAlcoholReviews() {
  const {counts, ...inbox} = useReviewInbox('aprobador-rendiciones', 'MIS_PENDIENTES');
  return {
    ...inbox,
    totalMyPending: counts.MIS_PENDIENTES || 0,
    totalApproved: counts.APROBADOS || 0,
    totalRejected: counts.RECHAZADOS || 0,
  };
}

export default useApproverAlcoholReviews;
