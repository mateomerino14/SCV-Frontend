import {useState, useEffect, useRef} from 'react';
import {getPendingTripReviews, takeTripReview} from '../../services/approval/reviewService';
import {getEmployees} from '../../services/user/userService';
import {getSections} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useSupervisorPendingTrips() {
  const [trips, setTrips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState(null);
  const [error, setError] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [filters, setFilters] = useState({fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''});
  const [applyingFilters, setApplyingFilters] = useState(false);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const load = async (currentFilters = filtersRef.current) => {
    const data = await getPendingTripReviews(currentFilters);
    if (data.error) {
      setError(data.error);
      return;
    }
    setTrips(data);
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      await load();
      const employeeData = await getEmployees();
      if (!employeeData.error) {
        setEmployees(employeeData);
      }
      const sectionData = await getSections();
      if (!sectionData.error) {
        setSections(sectionData);
      }
      setLoading(false);
    };
    start();
    const polling = setInterval(() => load(), pollingInterval);
    return () => clearInterval(polling);
  }, []);

  const applyFilters = async () => {
    setApplyingFilters(true);
    await load(filters);
    setApplyingFilters(false);
  };

  const clearFilters = () => {
    const emptyFilters = {fecha_inicio: '', fecha_fin: '', id_empleado: '', id_seccion: ''};
    setFilters(emptyFilters);
    load(emptyFilters);
  };

  const handleTake = async (tripId) => {
    setTaking(tripId);
    const data = await takeTripReview(tripId);
    setTaking(null);
    if (data.error) {
      if (data.error.includes('ya fue tomado') || data.error.includes('siendo revisado')) {
        setAlreadyTaken(true);
      }
      else {
        setError(data.error);
      }
      await load();
      return;
    }
    await load();
  };

  const closeAlreadyTakenModal = () => setAlreadyTaken(false);

  return {
    trips,
    total: trips.length,
    employees,
    sections,
    loading, taking, error, alreadyTaken, closeAlreadyTakenModal,
    filters, setFilters, applyingFilters,
    applyFilters, clearFilters, handleTake,
    reload: load,
  };
}

export default useSupervisorPendingTrips;