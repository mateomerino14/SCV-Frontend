import {useState, useRef, useEffect} from 'react';

function usePositionSelector(positions, positionId, onChange) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuPosition, setMenuPosition] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const selectedPosition = positions.find((position) => String(position.id_cargo) === String(positionId));

  const filteredPositions = positions
    .filter((position) => position.activo)
    .filter((position) => position.nombre.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

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
      return;
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

  const handleSelect = (position) => {
    onChange(position.id_cargo);
    setOpen(false);
    setSearch('');
  };

  return {
    open, search, setSearch, menuPosition,
    wrapperRef, triggerRef, menuRef, inputRef,
    selectedPosition, filteredPositions,
    handleToggle, handleSelect,
  };
}

export default usePositionSelector;