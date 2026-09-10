import {useState} from 'react';
import {takeTripReview} from '../../../services/approval/reviewService';

function useTakeTripReview() {
  const [taking, setTaking] = useState(false);
  const [error, setError] = useState('');

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const handleTake = async (tripId) => {
    setTaking(true);
    const data = await takeTripReview(tripId);
    setTaking(false);
    if (data.error) {
      showError(data.error);
      return;
    }
    window.location.reload();
  };

  return {taking, error, handleTake};
}

export default useTakeTripReview;