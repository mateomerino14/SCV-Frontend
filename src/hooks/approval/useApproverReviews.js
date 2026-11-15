import useReviewInbox from './useReviewInbox';

function useApproverReviews() {
  const {counts, ...inbox} = useReviewInbox('aprobador-viajes', 'MIS_PENDIENTES');
  return {
    ...inbox,
    totalMyPending: counts.MIS_PENDIENTES || 0,
    totalApproved: counts.APROBADOS || 0,
    totalRejected: counts.RECHAZADOS || 0,
  };
}

export default useApproverReviews;
