/**
 * Formats a date value into "DD Mon YYYY" format (e.g. "12 Oct 2026").
 * Accepts a Date object, ISO string, or moment-compatible string.
 */
export const formatDate = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default formatDate;
