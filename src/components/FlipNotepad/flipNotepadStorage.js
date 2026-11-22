const PREFIX = 'notepad:';
const memoryStore = new Map();

export const pad = (value) => String(value).padStart(2, '0');

export const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateKey = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfDay = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return startOfDay();

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatMonthYear = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const formatWeekday = (date) =>
  date.toLocaleDateString(undefined, { weekday: 'long' });

const storageKey = (date, prefix) => `${prefix}${dateKey(date)}`;

const readRaw = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? (memoryStore.get(key) ?? '') : value;
  } catch {
    return memoryStore.get(key) ?? '';
  }
};

const writeRaw = (key, value) => {
  memoryStore.set(key, value);

  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage can be unavailable (private mode, quota, etc.).
  }
};

export const readNote = (date, prefix = PREFIX) =>
  readRaw(storageKey(date, prefix));

export const writeNote = (date, value, prefix = PREFIX) =>
  writeRaw(storageKey(date, prefix), value);
