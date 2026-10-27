import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {CalendarDays, ChevronLeft, ChevronRight} from 'lucide-react';
import {COLORS} from '../../constants';
import useDatePicker from '../../hooks/shared/useDatePicker';
import {weekdayInitials, buildMonthDays, formatDisplayDate, formatHeaderDate, formatLongDay, monthTitle, isOutside, rangePositionOf, todayIso} from '../../utils/calendar';

const styles = {
  trigger: 'w-full flex items-center justify-between gap-2 bg-transparent border-none p-0 font-inter text-sm text-left cursor-pointer',
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm px-4',
  card: 'w-full max-w-[340px] rounded-2xl overflow-hidden shadow-xl',
  header: 'px-5 py-4 flex flex-col gap-0.5',
  headerYear: 'text-xs font-inter',
  headerDate: 'text-2xl font-bold font-inter',
  body: 'p-4 flex flex-col gap-2.5',
  monthRow: 'flex items-center justify-between',
  monthTitle: 'text-sm font-bold font-inter',
  navGroup: 'flex gap-1.5',
  navBtn: 'w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer',
  weekdays: 'grid grid-cols-7 text-center text-[11px] font-bold font-inter',
  days: 'grid grid-cols-7 gap-y-1',
  day: 'h-10 text-[13px] font-inter border-none',
  footer: 'flex items-center gap-2 pt-1',
  footerSpacer: 'flex-1',
  textBtn: 'h-10 px-3 rounded-xl font-bold font-nunito text-sm cursor-pointer border-none bg-transparent',
  confirmBtn: 'h-10 px-5 rounded-xl font-bold font-nunito text-sm cursor-pointer border-none',
};

const rangeRadius = {single: '10px', start: '10px 0 0 10px', end: '0 10px 10px 0', middle: '0'};

const dayStyleOf = (iso, draft, rangePosition, disabled) => {
  const style = {borderRadius: '10px', backgroundColor: 'transparent', color: COLORS.text, cursor: 'pointer', fontWeight: 500};
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
  if (iso === draft) {
    style.backgroundColor = COLORS.primary;
    style.color = COLORS.background;
    style.borderRadius = '10px';
    style.fontWeight = 700;
    style.boxShadow = 'none';
  }
  return style;
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.95, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function DatePickerInput({value, onChange, min, max, rangeStart, rangeEnd, disabled = false, clearable = false, placeholder = 'dd/mm/aaaa'}) {
  const {open, draft, view, openPicker, close, previousMonth, nextMonth, pick} = useDatePicker();
  const days = buildMonthDays(view.year, view.month);
  let triggerText = placeholder;
  let triggerColor = COLORS.labels;
  if (value) {
    triggerText = formatDisplayDate(value);
    triggerColor = COLORS.text;
  }
  let headerDate = 'Elige una fecha';
  let headerYear = view.year;
  if (draft) {
    headerDate = formatHeaderDate(draft);
    headerYear = draft.slice(0, 4);
  }
  const confirm = () => {
    if (draft) {
      onChange(draft);
    }
    close();
  };
  const clear = () => {
    onChange('');
    close();
  };
  return (
    <>
      <button type="button" className={styles.trigger} data-date-field disabled={disabled} onClick={() => openPicker(value, rangeStart || min)}
        style={{color: triggerColor, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer'}}>
        <span>{triggerText}</span>
        <CalendarDays size={18} style={{color: COLORS.primary}} />
      </button>
      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div className={styles.overlay} style={{backgroundColor: COLORS.overlay}} onClick={close}
            variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}>
            <motion.div className={styles.card} role="dialog" aria-label="Elegir fecha" data-month={`${view.year}-${String(view.month + 1).padStart(2, '0')}`}
              style={{backgroundColor: COLORS.background}} onClick={(event) => event.stopPropagation()}
              variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}>
              <div className={styles.header} style={{backgroundColor: COLORS.primary}}>
                <span className={styles.headerYear} style={{color: COLORS.onColorText80}}>{headerYear}</span>
                <span className={styles.headerDate} style={{color: COLORS.background}}>{headerDate}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.monthRow}>
                  <span className={styles.monthTitle} style={{color: COLORS.text}}>{monthTitle(view.year, view.month)}</span>
                  <div className={styles.navGroup}>
                    <button type="button" className={styles.navBtn} aria-label="Mes anterior" onClick={previousMonth} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
                      <ChevronLeft size={16} style={{color: COLORS.text}} />
                    </button>
                    <button type="button" className={styles.navBtn} aria-label="Mes siguiente" onClick={nextMonth} style={{borderColor: COLORS.dataFields, backgroundColor: COLORS.background}}>
                      <ChevronRight size={16} style={{color: COLORS.text}} />
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
                      <button key={cell.key} type="button" className={styles.day} data-date={cell.iso} aria-label={formatLongDay(cell.iso)} aria-pressed={cell.iso === draft}
                        disabled={outside} onClick={() => pick(cell.iso)} style={dayStyleOf(cell.iso, draft, rangePositionOf(cell.iso, rangeStart, rangeEnd), outside)}>
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
                <div className={styles.footer}>
                  {clearable && value && (
                    <button type="button" className={styles.textBtn} style={{color: COLORS.secondary}} onClick={clear}>Borrar</button>
                  )}
                  <span className={styles.footerSpacer} />
                  <button type="button" className={styles.textBtn} style={{color: COLORS.labels}} onClick={close}>Cancelar</button>
                  <button type="button" className={styles.confirmBtn} disabled={!draft} onClick={confirm}
                    style={{backgroundColor: COLORS.primary, color: COLORS.background, opacity: draft ? 1 : 0.6}}>Aceptar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}

export default DatePickerInput;
