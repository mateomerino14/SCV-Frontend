import {useState, useEffect} from 'react';
import {getDashboard} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
      }
      const result = await getDashboard();
      if (isInitialLoad) {
        setLoading(false);
      }
      if (!result.error) {
        setData(result);
      }
    };
    load(true);
    const polling = setInterval(() => load(false), pollingInterval);
    return () => clearInterval(polling);
  }, []);
  return {data, loading};
}

export default useAdminDashboard;