/**
 * Normalize a Date object or ISO date string (e.g. "2026-11-26" or ISO timestamp)
 * into a local YYYY-MM-DD key without UTC timezone day-shift for date-only strings.
 */
export function toDateKey(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD or Date value as a local Date (avoiding UTC midnight shift).
 */
export function parseLocalDate(value) {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  return new Date(value);
}

/**
 * Format a date consistently for docket headers and metadata.
 */
export function formatDisplayDate(value, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  const d = parseLocalDate(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', options);
}
