import {useState} from 'react';
import {todayIso, monthOfIso, shiftMonth} from '../../utils/calendar';

function useDatePicker() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [view, setView] = useState(monthOfIso(todayIso()));

  const openPicker = (value, fallback) => {
    const initial = value || fallback || todayIso();
    setDraft(value || '');
    setView(monthOfIso(initial));
    setOpen(true);
  };
  const close = () => setOpen(false);
  const previousMonth = () => setView((current) => shiftMonth(current.year, current.month, -1));
  const nextMonth = () => setView((current) => shiftMonth(current.year, current.month, 1));
  return {open, draft, view, openPicker, close, previousMonth, nextMonth, pick: setDraft};
}

export default useDatePicker;
