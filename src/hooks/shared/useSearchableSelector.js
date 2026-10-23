import {useState, useRef, useEffect} from 'react';

// Quita tildes y mayusculas para que "tesoreria" encuentre "Tesorería"
export function normalizeSearchText(text) {
  return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Lista desplegable con buscador. options: [{value, label, searchText?}]
function useSearchableSelector(options, selectedValue, onChange) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuPosition, setMenuPosition] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((option) => String(option.value) === String(selectedValue));
  const normalizedSearch = normalizeSearchText(search.trim());
  const filteredOptions = normalizedSearch
    ? options.filter((option) => normalizeSearchText(option.searchText || option.label).includes(normalizedSearch))
    : options;

  const calculateMenuPosition = () => {
    if (!triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUpward = spaceBelow < 280;
    setMenuPosition({
      left: rect.left,
      width: rect.width,
      top: opensUpward ? undefined : rect.bottom + 4,
      bottom: opensUpward ? window.innerHeight - rect.top + 4 : undefined,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handleReposition = () => calculateMenuPosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open]);

  const handleToggle = () => {
    const nextState = !open;
    if (nextState) {
      calculateMenuPosition();
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    setOpen(nextState);
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
    setSearch('');
  };

  return {
    open, search, setSearch, menuPosition,
    wrapperRef, triggerRef, menuRef, inputRef,
    selectedOption, filteredOptions,
    handleToggle, handleSelect,
  };
}

export default useSearchableSelector;
