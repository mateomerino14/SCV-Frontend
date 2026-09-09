import {useState, useRef, useEffect} from 'react';

function useSimpleSelector(threshold = 220) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
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
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpensUpward(spaceBelow < threshold);
    }
    setOpen(!open);
  };

  const close = () => setOpen(false);

  return {open, opensUpward, wrapperRef, triggerRef, toggle, close};
}

export default useSimpleSelector;