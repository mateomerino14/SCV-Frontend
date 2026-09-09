import {useState} from 'react';
import {submitTripForReview} from '../../../services/trip/tripService';

function useSubmitDraftTrip(tripId, onSuccess) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 4000);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const data = await submitTripForReview(tripId);
    setSubmitting(false);
    setShowModal(false);
    if (data?.error) {
      showError(data.error);
      return;
    }
    onSuccess();
  };
  return {showModal, setShowModal, submitting, error, handleConfirm};
}

export default useSubmitDraftTrip;