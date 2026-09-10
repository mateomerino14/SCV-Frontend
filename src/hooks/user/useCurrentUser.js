import {useState, useEffect} from 'react';
import {getMe} from '../../services/user/userService';

function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getMe();
      setLoading(false);
      if (!data.error) {
        setUser(data);
      }
    };
    load();
  }, []);
  return {user, loading};
}

export default useCurrentUser;