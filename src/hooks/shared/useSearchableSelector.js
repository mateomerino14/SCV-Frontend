import {useState, useRef, useEffect} from 'react';
import {makeRoomBelow, listHeightBelow, menuTopBelow} from '../../utils/dropdownSpace';

const preferredListHeight = 208;
const maxVisibleOptions = 100;
const searchInputHeight = 40;

export function normalizeSearchText(text) {
  return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

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
  const matchingOptions = options.filter((option) => !normalizedSearch || normalizeSearchText(option.searchText || option.label).includes(normalizedSearch));
  const filteredOptions = matchingOptions.slice(0, maxVisibleOptions);
  const hiddenCount = matchingOptions.length - filteredOptions.length;

  const calculateMenuPosition = () => {
    if (!triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      left: rect.left,
      width: rect.width,
      top: menuTopBelow(triggerRef.current),
      listHeight: listHeightBelow(triggerRef.current, preferredListHeight, searchInputHeight),
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
      makeRoomBelow(triggerRef.current, searchInputHeight);
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
    selectedOption, filteredOptions, hiddenCount,
    handleToggle, handleSelect,
  };
}

export default useSearchableSelector;
