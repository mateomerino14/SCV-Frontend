import {useState, useEffect} from 'react';
import {getDashboard} from '../../services/admin/adminService';

const pollingInterval = 30 * 1000;

function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
      }
      const result = await getDashboard();
      if (isInitialLoad) {
        setLoading(false);
      }
      // Si falla se conservan los datos; con cambio de contrasena pendiente no se avisa error
      if (result.error && result.error.includes('cambiar tu contraseña')) {
        return;
      }
      if (result.error) {
        setError('No se pudo actualizar el resumen. Se reintentará en unos segundos.');
        return;
      }
      setError('');
      setData(result);
    };
    load(true);
    const polling = setInterval(() => load(false), pollingInterval);
    return () => clearInterval(polling);
  }, []);
  return {data, loading, error};
}

export default useAdminDashboard;