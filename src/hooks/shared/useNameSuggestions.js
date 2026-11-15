import {useState, useEffect} from 'react';
import {normalizeSearchText} from './useSearchableSelector';

const suggestionDelay = 300;
const suggestionLimit = 5;

function useNameSuggestions(fetchList, name, isOpen, idField, excludeId) {
  const [found, setFound] = useState({search: '', items: []});
  const search = normalizeSearchText(name.trim());
  const enabled = isOpen && search.length >= 2;

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let active = true;
    const timer = setTimeout(async () => {
      const data = await fetchList({search, page: 1, limit: suggestionLimit});
      if (active && Array.isArray(data.items)) {
        setFound({search, items: data.items});
      }
    }, suggestionDelay);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchList, search, enabled]);

  if (!enabled || found.search !== search) {
    return [];
  }
  return found.items.filter((item) => item[idField] !== excludeId);
}

export default useNameSuggestions;
