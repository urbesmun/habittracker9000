import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isDateInThisWeek(dateStr: string) {
  const date = parseISO(dateStr);
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return isWithinInterval(date, { start, end });
}

export function isDateInThisMonth(dateStr: string) {
  const date = parseISO(dateStr);
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return isWithinInterval(date, { start, end });
}

export function getPast7Days() {
  const days: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(format(d, 'yyyy-MM-dd'));
  }
  return days;
}

export function formatDateShort(dateStr: string) {
  return format(parseISO(dateStr), 'dd/MM');
}
