import {useEffect, useState} from 'react';
import {getMySignature, saveMySignature} from '../../services/user/userService';

function useStoredSignature(active) {
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    let current = true;
    getMySignature().then((data) => {
      if (!current) {
        return;
      }
      setLoading(false);
      if (data.error) {
        setLoadError(data.error);
        return;
      }
      setLoadError('');
      setSignature(data.firma);
    });
    return () => {
      current = false;
    };
  }, [active]);

  const save = async (image, password) => {
    const data = await saveMySignature(image, password);
    if (!data.error) {
      setSignature(data.firma);
    }
    return data;
  };

  return {signature, loading, loadError, save};
}

export default useStoredSignature;
