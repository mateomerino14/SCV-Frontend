import {useState, useRef, useLayoutEffect, useEffect, useCallback} from 'react';
import {todayIso, monthOfIso, shiftMonth} from '../../utils/calendar';

const popoverGap = 6;
const viewportMargin = 12;

const positionBelow = (anchor, popover) => {
  const anchorBox = anchor.getBoundingClientRect();
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const maxLeft = window.innerWidth - width - viewportMargin;
  const left = Math.max(viewportMargin, Math.min(anchorBox.left, maxLeft));
  let top = anchorBox.bottom + popoverGap;
  const fitsBelow = top + height <= window.innerHeight - viewportMargin;
  const fitsAbove = anchorBox.top - popoverGap - height >= viewportMargin;
  if (!fitsBelow && fitsAbove) {
    top = anchorBox.top - popoverGap - height;
  }
  return {top, left};
};

function useDatePicker() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(monthOfIso(todayIso()));
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const reposition = useCallback(() => {
    const anchor = triggerRef.current?.parentElement;
    if (anchor && popoverRef.current) {
      setPosition(positionBelow(anchor, popoverRef.current));
    }
  }, []);

  const openPicker = (value, fallback) => {
    setView(monthOfIso(value || fallback || todayIso()));
    setPosition(null);
    setOpen(true);
  };
  const close = useCallback(() => setOpen(false), []);
  const toggle = (value, fallback) => {
    if (open) {
      close();
    }
    else {
      openPicker(value, fallback);
    }
  };

  useLayoutEffect(() => {
    if (open) {
      reposition();
    }
  }, [open, view, reposition]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const closeOnOutside = (event) => {
      const insidePopover = popoverRef.current?.contains(event.target);
      const insideTrigger = triggerRef.current?.contains(event.target);
      if (!insidePopover && !insideTrigger) {
        close();
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open, close, reposition]);

  const previousMonth = () => setView((current) => shiftMonth(current.year, current.month, -1));
  const nextMonth = () => setView((current) => shiftMonth(current.year, current.month, 1));
  return {open, view, position, triggerRef, popoverRef, toggle, close, previousMonth, nextMonth};
}

export default useDatePicker;
