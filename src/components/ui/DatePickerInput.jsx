import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {CalendarDays, ChevronLeft, ChevronRight} from 'lucide-react';
import {COLORS} from '../../constants';
import useDatePicker from '../../hooks/shared/useDatePicker';
import {weekdayInitials, buildMonthDays, formatDisplayDate, formatLongDay, monthTitle, isOutside, rangePositionOf, todayIso} from '../../utils/calendar';

const styles = {
  trigger: 'w-full flex items-center justify-between gap-2 bg-transparent border-none p-0 font-inter text-sm text-left cursor-pointer',
  popover: 'fixed z-[9999] w-[288px] rounded-2xl border shadow-xl p-3 flex flex-col gap-2',
  monthRow: 'flex items-center justify-between pl-1',
  monthTitle: 'text-[13px] font-bold font-inter',
  navGroup: 'flex gap-1',
  navBtn: 'w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer',
  weekdays: 'grid grid-cols-7 text-center text-[10px] font-bold font-inter',
  days: 'grid grid-cols-7 gap-y-0.5',
  day: 'h-8 text-[12px] font-inter border-none',
  footer: 'flex items-center justify-between border-t pt-2',
  textBtn: 'h-8 px-2 rounded-lg font-bold font-nunito text-[13px] cursor-pointer border-none bg-transparent',
};

const rangeRadius = {single: '8px', start: '8px 0 0 8px', end: '0 8px 8px 0', middle: '0'};

const dayStyleOf = (iso, value, rangePosition, disabled) => {
  const style = {borderRadius: '8px', backgroundColor: 'transparent', color: COLORS.text, cursor: 'pointer', fontWeight: 500};
  if (rangePosition) {
    style.backgroundColor = COLORS.primarySoft;
    style.color = COLORS.title;
    style.borderRadius = rangeRadius[rangePosition];
    style.fontWeight = 600;
  }
  if (iso === todayIso()) {
    style.boxShadow = `inset 0 0 0 1.5px ${COLORS.primary}`;
  }
  if (disabled) {
    style.color = COLORS.fields;
    style.cursor = 'default';
  }
  if (iso === value) {
    style.backgroundColor = COLORS.primary;
    style.color = COLORS.background;
    style.borderRadius = '8px';
    style.fontWeight = 700;
    style.boxShadow = 'none';
  }
  return style;
};

const popoverVariants = {hidden: {opacity: 0, y: -4, scale: 0.98}, visible: {opacity: 1, y: 0, scale: 1}};

function DatePickerInput({value, onChange, min, max, rangeStart, rangeEnd, disabled = false, clearable = false, placeholder = 'dd/mm/aaaa'}) {
  const {open, view, position, triggerRef, popoverRef, toggle, close, previousMonth, nextMonth} = useDatePicker();
  const days = buildMonthDays(view.year, view.month);
  const today = todayIso();
  const canPickToday = !isOutside(today, min, max);
  let triggerText = placeholder;
  let triggerColor = COLORS.labels;
  if (value) {
    triggerText = formatDisplayDate(value);
    triggerColor = COLORS.text;
  }
  const choose = (iso) => {
    onChange(iso);
    close();
  };
  let popoverPosition = {top: 0, left: 0, visibility: 'hidden'};
  if (position) {
    popoverPosition = position;
  }
  return (
    <>
      <button ref={triggerRef} type="button" className={styles.trigger} data-date-field disabled={disabled} aria-expanded={open}
        onClick={() => toggle(value, rangeStart || min)} style={{color: triggerColor, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer'}}>
        <span>{triggerText}</span>
        <CalendarDays size={18} style={{color: COLORS.primary}} />
      </button>
      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div ref={popoverRef} className={styles.popover} role="dialog" aria-label="Elegir fecha"
            data-month={`${view.year}-${String(view.month + 1).padStart(2, '0')}`}
            style={{...popoverPosition, backgroundColor: COLORS.background, borderColor: COLORS.dataFields}}
            variants={popoverVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15, ease: [0.22, 1, 0.36, 1]}}>
            <div className={styles.monthRow}>
              <span className={styles.monthTitle} style={{color: COLORS.text}}>{monthTitle(view.year, view.month)}</span>
              <div className={styles.navGroup}>
                <button type="button" className={styles.navBtn} aria-label="Mes anterior" onClick={previousMonth} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
                  <ChevronLeft size={14} style={{color: COLORS.text}} />
                </button>
                <button type="button" className={styles.navBtn} aria-label="Mes siguiente" onClick={nextMonth} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
                  <ChevronRight size={14} style={{color: COLORS.text}} />
                </button>
              </div>
            </div>
            <div className={styles.weekdays} style={{color: COLORS.labels}}>
              {weekdayInitials.map((initial, index) => <span key={`${initial}-${index}`}>{initial}</span>)}
            </div>
            <div className={styles.days}>
              {days.map((cell) => {
                if (!cell.iso) {
                  return <span key={cell.key} />;
                }
                const outside = isOutside(cell.iso, min, max);
                return (
                  <button key={cell.key} type="button" className={styles.day} data-date={cell.iso} aria-label={formatLongDay(cell.iso)} aria-pressed={cell.iso === value}
                    disabled={outside} onClick={() => choose(cell.iso)} style={dayStyleOf(cell.iso, value, rangePositionOf(cell.iso, rangeStart, rangeEnd), outside)}>
                    {cell.day}
                  </button>
                );
              })}
            </div>
            <div className={styles.footer} style={{borderColor: COLORS.dataFields}}>
              <button type="button" className={styles.textBtn} style={{color: COLORS.primary, opacity: canPickToday ? 1 : 0.4}} disabled={!canPickToday} onClick={() => choose(today)}>Hoy</button>
              {clearable && value && (
                <button type="button" className={styles.textBtn} style={{color: COLORS.secondary}} onClick={() => choose('')}>Borrar</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}

export default DatePickerInput;
