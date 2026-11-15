import useReviewInbox from './useReviewInbox';

function useTreasurerReviews() {
  const {counts, ...inbox} = useReviewInbox('tesoreria', 'PENDIENTES');
  return {
    ...inbox,
    totalPending: counts.PENDIENTES || 0,
    totalApproved: counts.APROBADOS || 0,
    totalRejected: counts.RECHAZADOS || 0,
  };
}

export default useTreasurerReviews;
