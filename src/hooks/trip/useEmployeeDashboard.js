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
  const [loadError, setLoadError] = useState('');

  const loadDashboard = async () => {
    const data = await getDashboard();
    // Si falla, se conservan los datos anteriores en vez de mostrar el panel vacio
    // Mientras se exige el cambio de contraseña la ventana de cambio ya lo indica: no se avisa error
    if (data.error && data.error.includes('cambiar tu contraseña')) {
      return;
    }
    if (data.error) {
      setLoadError('No se pudieron actualizar tus viajes. Revisa tu conexión; se reintentará en unos segundos.');
      return;
    }
    setLoadError('');
    setDraftTrips(data.viajesBorrador || []);
    setInProgressTrips(data.viajesEnCurso || []);
    setSubstitutionTrips(data.viajesSustitucion || []);
    setRecentTrips(data.viajesRecientes || []);
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      const [userData] = await Promise.all([getMe(), loadDashboard()]);
      if (!userData?.error) {
        setUser(userData);
      }
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
    loadError,
    tripToConfirm,
    handleRequestSubmitReview,
    handleCancelSubmitReview,
    handleConfirmSubmitReview,
  };
}

export default useEmployeeDashboard;