import {useState, useRef, useEffect} from 'react';
import {makeRoomBelow, listHeightBelow} from '../../utils/dropdownSpace';

function useSimpleSelector(preferredHeight = 224, reservedHeight = 0) {
  const [open, setOpen] = useState(false);
  const [listHeight, setListHeight] = useState(preferredHeight);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => {
    if (!open && triggerRef.current) {
      makeRoomBelow(triggerRef.current, reservedHeight);
      setListHeight(listHeightBelow(triggerRef.current, preferredHeight, reservedHeight));
    }
    setOpen(!open);
  };
  const close = () => setOpen(false);
  return {open, listHeight, wrapperRef, triggerRef, toggle, close};
}

export default useSimpleSelector;
