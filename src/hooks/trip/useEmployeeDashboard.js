import {useState, useEffect} from 'react';
import {getMe} from '../../services/user/userService';
import {getDashboard, submitTripForReview} from '../../services/trip/tripService';

const pollingInterval = 30 * 1000;

function useEmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [draftTrips, setDraftTrips] = useState([]);
  const [inProgressTrips, setInProgressTrips] = useState([]);
  const [substitutionTrips, setSubstitutionTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [tripToConfirm, setTripToConfirm] = useState(null);

  const loadDashboard = async () => {
    const data = await getDashboard();
    setDraftTrips(data.viajesBorrador || []);
    setInProgressTrips(data.viajesEnCurso || []);
    setSubstitutionTrips(data.viajesSustitucion || []);
    setRecentTrips(data.viajesRecientes || []);
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      const [userData] = await Promise.all([getMe(), loadDashboard()]);
      setUser(userData);
      setLoading(false);
    };
    start();
    const polling = setInterval(() => loadDashboard(), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const displayedTrips = recentTrips.slice(0, 3);
  const handleRequestSubmitReview = (tripId) => setTripToConfirm(tripId);
  const handleCancelSubmitReview = () => setTripToConfirm(null);

  const handleConfirmSubmitReview = async () => {
    if (!tripToConfirm) {
      return;
    }
    setSubmittingReview(tripToConfirm);
    const data = await submitTripForReview(tripToConfirm);
    setSubmittingReview(null);
    setTripToConfirm(null);
    if (data.error) {
      setSubmitError(data.error);
      setTimeout(() => setSubmitError(''), 4000);
      return;
    }
    await loadDashboard();
  };

  return {
    user,
    draftTrips,
    inProgressTrips,
    substitutionTrips,
    displayedTrips,
    recentTrips,
    loading,
    submittingReview,
    submitError,
    tripToConfirm,
    handleRequestSubmitReview,
    handleCancelSubmitReview,
    handleConfirmSubmitReview,
  };
}

export default useEmployeeDashboard;