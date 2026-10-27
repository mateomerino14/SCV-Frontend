import {useState} from 'react';
import {COLORS} from '../../../constants';

const firstFrequentHour = 7;
const lastFrequentHour = 22;
const minuteStep = 5;
const hoursPerDay = 24;
const minutesPerHour = 60;

const styles = {
  headerRow: 'flex items-center justify-between mb-2',
  label: 'text-xs font-inter uppercase',
  counter: 'text-xs font-bold font-inter',
  grid: 'grid grid-cols-4 gap-2',
  tile: 'h-11 rounded-xl border text-sm font-bold font-inter cursor-pointer transition-colors',
  linkBtn: 'mt-3 py-1.5 text-sm font-bold font-nunito cursor-pointer bg-transparent border-none',
  customPanel: 'mt-3 rounded-2xl border p-3 flex flex-col gap-3',
  customLabel: 'text-[11px] font-bold font-inter uppercase',
  customGrid: 'grid grid-cols-6 gap-1.5',
  customTile: 'h-9 rounded-lg border text-xs font-bold font-inter cursor-pointer',
  customFooter: 'flex items-center justify-between gap-2',
  customValue: 'text-lg font-bold font-inter',
  addBtn: 'h-10 px-5 rounded-xl text-sm font-bold font-nunito cursor-pointer border-none',
  hint: 'text-xs font-inter mt-2',
};

const pad = (value) => String(value).padStart(2, '0');

const frequentTimes = Array.from({length: lastFrequentHour - firstFrequentHour + 1}, (_, index) => `${pad(firstFrequentHour + index)}:00`);
const hourOptions = Array.from({length: hoursPerDay}, (_, index) => pad(index));
const minuteOptions = Array.from({length: minutesPerHour / minuteStep}, (_, index) => pad(index * minuteStep));

const tileStyleOf = (selected, full) => {
  if (selected) {
    return {backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background};
  }
  return {backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.text, opacity: full ? 0.5 : 1};
};

function ReminderTimesPicker({times, maxTimes, newTime, setNewTime, onToggleTime, onAddTime}) {
  const [showCustom, setShowCustom] = useState(false);
  const full = times.length >= maxTimes;
  const shownTimes = [...new Set([...frequentTimes, ...times])].sort();
  const [customHour = '', customMinute = ''] = (newTime || '').split(':');
  const pickHour = (hour) => setNewTime(`${hour}:${customMinute || '00'}`);
  const pickMinute = (minute) => setNewTime(`${customHour || '08'}:${minute}`);
  let customLinkText = '+ Otra hora';
  if (showCustom) {
    customLinkText = 'Ocultar otra hora';
  }
  return (
    <div>
      <div className={styles.headerRow}>
        <p className={styles.label} style={{color: COLORS.labels}}>Horas de envío</p>
        <span className={styles.counter} style={{color: COLORS.primary}}>{times.length} de {maxTimes}</span>
      </div>
      <div className={styles.grid}>
        {shownTimes.map((time) => {
          const selected = times.includes(time);
          return (
            <button key={time} type="button" className={styles.tile} aria-pressed={selected} disabled={full && !selected}
              onClick={() => onToggleTime(time)} style={tileStyleOf(selected, full)}>
              {time}
            </button>
          );
        })}
      </div>
      {!full && (
        <button type="button" className={styles.linkBtn} style={{color: COLORS.primary}} onClick={() => setShowCustom(!showCustom)}>{customLinkText}</button>
      )}
      {showCustom && !full && (
        <div className={styles.customPanel} style={{borderColor: COLORS.dataFields}}>
          <p className={styles.customLabel} style={{color: COLORS.labels}}>Hora</p>
          <div className={styles.customGrid}>
            {hourOptions.map((hour) => (
              <button key={hour} type="button" className={styles.customTile} aria-pressed={hour === customHour} onClick={() => pickHour(hour)}
                style={tileStyleOf(hour === customHour, false)}>
                {hour}
              </button>
            ))}
          </div>
          <p className={styles.customLabel} style={{color: COLORS.labels}}>Minutos</p>
          <div className={styles.customGrid}>
            {minuteOptions.map((minute) => (
              <button key={minute} type="button" className={styles.customTile} aria-pressed={minute === customMinute} onClick={() => pickMinute(minute)}
                style={tileStyleOf(minute === customMinute, false)}>
                {minute}
              </button>
            ))}
          </div>
          <div className={styles.customFooter}>
            <span className={styles.customValue} style={{color: COLORS.title}}>{newTime || '--:--'}</span>
            <button type="button" className={styles.addBtn} onClick={() => onAddTime()} style={{backgroundColor: COLORS.primary, color: COLORS.background}}>Agregar</button>
          </div>
        </div>
      )}
      <p className={styles.hint} style={{color: COLORS.labels}}>Toca una hora para marcarla o quitarla. Hasta {maxTimes} envíos por día, en hora de Bolivia.</p>
    </div>
  );
}

export default ReminderTimesPicker;
