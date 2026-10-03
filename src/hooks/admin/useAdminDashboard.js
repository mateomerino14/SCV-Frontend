import {useState, useEffect, useRef} from 'react';
import {getDashboard} from '../../services/admin/adminService';
import {getPresetRange} from '../../utils/periodRange';

const pollingInterval = 30 * 1000;

function useAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preset, setPreset] = useState('mes');
  const [customRange, setCustomRange] = useState({fecha_inicio: '', fecha_fin: ''});
  const [appliedPeriod, setAppliedPeriod] = useState(() => getPresetRange('mes'));
  const [rangeError, setRangeError] = useState('');
  const appliedPeriodRef = useRef(appliedPeriod);

  useEffect(() => {
    appliedPeriodRef.current = appliedPeriod;
    let cancelled = false;
    const load = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoading(true);
      }
      const result = await getDashboard(appliedPeriodRef.current);
      if (cancelled) {
        return;
      }
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
    return () => {
      cancelled = true;
      clearInterval(polling);
    };
  }, [appliedPeriod]);

  const selectPreset = (value) => {
    setPreset(value);
    setRangeError('');
    if (value !== 'rango') {
      setAppliedPeriod(getPresetRange(value));
    }
  };

  const applyCustomRange = () => {
    if (!customRange.fecha_inicio || !customRange.fecha_fin) {
      setRangeError('Elige las dos fechas del periodo');
      return;
    }
    if (customRange.fecha_inicio > customRange.fecha_fin) {
      setRangeError('');
      return;
    }
    setRangeError('');
    setAppliedPeriod({...customRange});
  };

  return {data, loading, error, preset, selectPreset, customRange, setCustomRange, applyCustomRange, rangeError, appliedPeriod};
}

export default useAdminDashboard;
