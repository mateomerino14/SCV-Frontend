import {BellRing, Plus, X} from 'lucide-react';
import ConfigToggle from '../../user/atoms/ConfigToggle';
import {COLORS} from '../../../constants';

const styles = {
  card: 'rounded-2xl p-4 shadow-md mb-5',
  cardTitle: 'text-xs font-bold font-inter uppercase mb-3',
  block: 'mt-4',
  label: 'text-xs font-inter uppercase mb-2',
  daysRow: 'grid grid-cols-7 gap-1.5',
  dayBtn: 'py-2 rounded-xl text-xs font-bold font-nunito cursor-pointer border transition-colors text-center',
  timesRow: 'flex flex-wrap gap-2',
  timeChip: 'flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-bold font-inter',
  removeBtn: 'w-6 h-6 rounded-full flex items-center justify-center cursor-pointer',
  addRow: 'flex gap-2 mt-3',
  timeInput: 'flex-1 rounded-xl px-3 py-2 text-sm font-inter outline-none border',
  addBtn: 'flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold font-nunito cursor-pointer',
  hint: 'text-xs font-inter mt-2',
  summary: 'text-sm font-inter rounded-xl px-3 py-2.5 mt-4 text-center',
};

const weekDays = [
  {value: 1, short: 'Lun', name: 'lunes'},
  {value: 2, short: 'Mar', name: 'martes'},
  {value: 3, short: 'Mié', name: 'miércoles'},
  {value: 4, short: 'Jue', name: 'jueves'},
  {value: 5, short: 'Vie', name: 'viernes'},
  {value: 6, short: 'Sáb', name: 'sábados'},
  {value: 0, short: 'Dom', name: 'domingos'},
];

function describeDays(days) {
  const sorted = weekDays.filter((day) => days.includes(day.value));
  if (sorted.length === 7) {
    return 'todos los días';
  }
  if (sorted.length === 5 && !days.includes(0) && !days.includes(6)) {
    return 'de lunes a viernes';
  }
  const names = sorted.map((day) => day.name);
  if (names.length === 1) {
    return `los ${names[0]}`;
  }
  return `los ${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

function describeTimes(times) {
  if (times.length === 1) {
    return `a las ${times[0]}`;
  }
  return `a las ${times.slice(0, -1).join(', ')} y ${times[times.length - 1]}`;
}

function ReminderScheduleCard({schedule, maxTimes, newTime, setNewTime, onToggleActive, onToggleDay, onAddTime, onRemoveTime}) {
  const disabled = !schedule.activo;
  let summary = 'Los recordatorios están desactivados: no se enviará ningún resumen automático.';
  if (schedule.activo && schedule.dias.length > 0 && schedule.horas.length > 0) {
    summary = `Se enviarán ${describeDays(schedule.dias)} ${describeTimes(schedule.horas)} (hora de Bolivia).`;
  }
  else if (schedule.activo) {
    summary = 'Elige al menos un día y una hora para programar los envíos.';
  }

  return (
    <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.fields}`}}>
      <p className={styles.cardTitle} style={{color: COLORS.labels}}>Programación</p>
      <ConfigToggle icon={BellRing} label="Recordatorios automáticos"
        description="Resumen de pendientes por correo para supervisores, aprobador, revisor y tesorero"
        checked={schedule.activo} onChange={onToggleActive} />

      <div className={styles.block} style={{opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto'}}>
        <p className={styles.label} style={{color: COLORS.labels}}>Días de la semana</p>
        <div className={styles.daysRow}>
          {weekDays.map((day) => {
            const selected = schedule.dias.includes(day.value);
            return (
              <button key={day.value} type="button" className={styles.dayBtn} onClick={() => onToggleDay(day.value)} aria-pressed={selected}
                style={{backgroundColor: selected ? COLORS.primary : 'transparent', borderColor: selected ? COLORS.primary : COLORS.dataFields, color: selected ? COLORS.background : COLORS.labels}}>
                {day.short}
              </button>
            );
          })}
        </div>

        <div className={styles.block}>
          <p className={styles.label} style={{color: COLORS.labels}}>Horas de envío</p>
          <div className={styles.timesRow}>
            {schedule.horas.map((time) => (
              <span key={time} className={styles.timeChip} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.title}}>
                {time}
                <span className={styles.removeBtn} role="button" aria-label={`Quitar ${time}`} onClick={() => onRemoveTime(time)}
                  style={{backgroundColor: COLORS.dataFields}}>
                  <X size={13} style={{color: COLORS.title}} />
                </span>
              </span>
            ))}
            {schedule.horas.length === 0 && <p className="text-sm font-inter" style={{color: COLORS.labels}}>Sin horas programadas</p>}
          </div>
          {schedule.horas.length < maxTimes && (
            <div className={styles.addRow}>
              <input type="time" className={styles.timeInput} value={newTime} onChange={(event) => setNewTime(event.target.value)}
                style={{borderColor: COLORS.dataFields, color: COLORS.text}} />
              <button type="button" className={styles.addBtn} onClick={onAddTime} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.primary}}>
                <Plus size={15} />
                Agregar
              </button>
            </div>
          )}
          <p className={styles.hint} style={{color: COLORS.labels}}>Hasta {maxTimes} envíos por día. Las horas son de Bolivia.</p>
        </div>
      </div>

      <p className={styles.summary} style={{backgroundColor: COLORS.backgroundHeader, color: COLORS.text}}>{summary}</p>
    </div>
  );
}

export default ReminderScheduleCard;
