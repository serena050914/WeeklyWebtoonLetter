// getWeekRangeLocal.ts
export function getWeekRangeLocal(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}
