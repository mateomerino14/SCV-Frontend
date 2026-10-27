const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const daysPerWeek = 7;

export const weekdayInitials = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const pad = (value) => String(value).padStart(2, '0');

export const toIsoDate = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;

export const todayIso = () => {
  const now = new Date();
  return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
};

export const monthOfIso = (iso) => {
  const [year, month] = String(iso).split('-').map(Number);
  return {year, month: month - 1};
};

export const formatDisplayDate = (iso) => {
  if (!iso) {
    return '';
  }
  const [year, month, day] = String(iso).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
};

export const formatLongDay = (iso) => {
  const [year, month, day] = String(iso).split('-').map(Number);
  return `${day} de ${monthNames[month - 1]} de ${year}`;
};

export const monthTitle = (year, month) => `${monthNames[month].charAt(0).toUpperCase()}${monthNames[month].slice(1)} ${year}`;

export const shiftMonth = (year, month, step) => {
  const date = new Date(year, month + step, 1);
  return {year: date.getFullYear(), month: date.getMonth()};
};

export const buildMonthDays = (year, month) => {
  const leading = (new Date(year, month, 1).getDay() + daysPerWeek - 1) % daysPerWeek;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({length: leading}, (_, index) => ({key: `blank-${index}`, iso: null, day: null}));
  for (let day = 1; day <= total; day++) {
    const iso = toIsoDate(year, month, day);
    cells.push({key: iso, iso, day});
  }
  return cells;
};

export const isOutside = (iso, min, max) => (!!min && iso < min) || (!!max && iso > max);

export const rangePositionOf = (iso, rangeStart, rangeEnd) => {
  if (!rangeStart || !rangeEnd || rangeStart > rangeEnd || iso < rangeStart || iso > rangeEnd) {
    return null;
  }
  if (rangeStart === rangeEnd) {
    return 'single';
  }
  if (iso === rangeStart) {
    return 'start';
  }
  if (iso === rangeEnd) {
    return 'end';
  }
  return 'middle';
};
