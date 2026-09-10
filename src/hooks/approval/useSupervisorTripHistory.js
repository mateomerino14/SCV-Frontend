import {useState, useEffect} from 'react';
import {getMyTripReviews} from '../../services/approval/reviewService';

function useSupervisorTripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('EN_REVISION_VIAJE');

  const load = async () => {
    setLoading(true);
    const data = await getMyTripReviews();
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setTrips(data);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    if (statusFilter === 'EN_REVISION_VIAJE') {
      return trip.estado === 'EN_REVISION_VIAJE';
    }
    if (statusFilter === 'APROBADO_VIAJE') {
      return ['APROBADO_VIAJE', 'EN_REVISION_TESORERO', 'EN_CURSO'].includes(trip.estado);
    }
    if (statusFilter === 'RECHAZADO') {
      return trip.estado === 'RECHAZADO';
    }
    return true;
  });

  return {
    trips: filteredTrips,
    total: filteredTrips.length,
    loading,
    error,
    statusFilter, setStatusFilter,
    reload: load,
  };
}

export default useSupervisorTripHistory;