import {useState, useEffect} from 'react';
import {getMyPosition} from '../../services/user/userService';

const treasurerPosition = 'asistente de caja y tesorería';

function normalize(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function useIsTreasurer() {
  const [isTreasurer, setIsTreasurer] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      const data = await getMyPosition();
      if (!data.error && data.cargo) {
        setIsTreasurer(normalize(data.cargo) === normalize(treasurerPosition));
      }
      setLoading(false);
    };
    verify();
  }, []);
  return {isTreasurer, loading};
}

export default useIsTreasurer;