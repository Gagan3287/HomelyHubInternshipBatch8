/**
 * Timezone-safe Date Formatter (en-IN format, e.g. "12 Oct 2026")
 * Accepts a Date object, ISO string, or timestamp.
 * Ensures ISO dates (e.g., "2026-10-01T00:00:00.000Z") never shift by a day due to local offset.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "";

  let year, month, day;

  if (typeof dateInput === "string") {
    const isoMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      year = parseInt(isoMatch[1], 10);
      month = parseInt(isoMatch[2], 10) - 1; // 0-indexed
      day = parseInt(isoMatch[3], 10);
    }
  }

  const d =
    year !== undefined
      ? new Date(Date.UTC(year, month, day))
      : dateInput instanceof Date
      ? dateInput
      : new Date(dateInput);

  if (isNaN(d.getTime())) return String(dateInput);

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: year !== undefined ? "UTC" : undefined,
  });
};

/**
 * Calculates number of nights between two dates in a timezone-safe manner.
 */
export const calculateNights = (fromDate, toDate, fallbackNights) => {
  if (fallbackNights && typeof fallbackNights === "number" && fallbackNights > 0) {
    return fallbackNights;
  }
  if (!fromDate || !toDate) return 1;

  const start = new Date(fromDate);
  const end = new Date(toDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

/**
 * Formats 24-hour time strings ("14:30" or "17:00:00") into 12-hour format ("2:30 PM", "5:00 PM").
 */
export const format12HourTime = (timeStr) => {
  if (!timeStr) return "N/A";
  if (typeof timeStr !== "string") return String(timeStr);

  if (/AM|PM/i.test(timeStr)) return timeStr.toUpperCase();

  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

export default formatDate;
