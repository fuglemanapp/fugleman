export const SAO_PAULO_TIME_ZONE = "America/Sao_Paulo";

type CalendarParts = {
  year: number;
  month: number;
  day: number;
};

function saoPauloParts(value: Date): CalendarParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function saoPauloCalendarDate(value: Date = new Date()) {
  const { year, month, day } = saoPauloParts(value);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function monthBoundsInSaoPaulo(value: Date = new Date()) {
  const { year, month } = saoPauloParts(value);
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
  };
}

export function nextStatementMonthInSaoPaulo(value: Date = new Date()) {
  const { year, month } = saoPauloParts(value);
  return new Date(Date.UTC(year, month, 1, 12));
}

export function monthKeyInSaoPaulo(value: Date = new Date()) {
  return saoPauloCalendarDate(value).slice(0, 7);
}
