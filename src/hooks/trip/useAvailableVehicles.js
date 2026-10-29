import {useState, useEffect} from 'react';
import {getAvailableVehicles} from '../../services/trip/tripService';

function useAvailableVehicles(enabled, tripId) {
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehiclesError, setVehiclesError] = useState('');

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let cancelled = false;
    const load = async () => {
      setLoadingVehicles(true);
      const data = await getAvailableVehicles(tripId);
      if (cancelled) {
        return;
      }
      setLoadingVehicles(false);
      if (data.error) {
        setVehiclesError(data.error);
        setVehicles([]);
      }
      else {
        setVehiclesError('');
        setVehicles(data);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [enabled, tripId]);

  return {vehicles, loadingVehicles, vehiclesError};
}

export default useAvailableVehicles;
