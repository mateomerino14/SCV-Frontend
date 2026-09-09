import {useState, useEffect} from 'react';
import {getMyTrips} from '../../services/approval/approverService';

function useApproverTripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('APROBADO_VIAJE');

  const load = async () => {
    setLoading(true);
    const data = await getMyTrips();
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
    if (statusFilter === 'APROBADO_VIAJE') {
      return trip.estado === 'APROBADO_VIAJE';
    }
    if (statusFilter === 'EN_REVISION_TESORERO') {
      return trip.estado === 'EN_REVISION_TESORERO';
    }
    if (statusFilter === 'EN_CURSO') {
      return trip.estado === 'EN_CURSO';
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

export default useApproverTripHistory;