import { parse, isValid, format as fmt } from "date-fns";

// Try multiple patterns to parse NASA date strings reliably
const CANDIDATE_PATTERNS = [
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "yyyy-MMM-dd",
  "yyyy-MMM-dd HH:mm",
  "yyyy-MM-dd HH:mm",
];

export function parseDateFlexible(input) {
  if (!input) return null;
  if (input instanceof Date) return isValid(input) ? input : null;
  // Timestamp or numeric
  if (typeof input === "number") {
    const d = new Date(input);
    return isValid(d) ? d : null;
  }
  // ISO or browser-parseable
  const auto = new Date(input);
  if (isValid(auto)) return auto;
  // Try known patterns
  for (const pattern of CANDIDATE_PATTERNS) {
    const d = parse(String(input), pattern, new Date());
    if (isValid(d)) return d;
  }
  return null;
}

export function formatReadableDate(input, { dayOfWeek = false } = {}) {
  const d = parseDateFlexible(input);
  if (!d) return String(input ?? "");
  const pattern = dayOfWeek ? "EEE, dd MMM yyyy" : "dd MMM yyyy";
  return fmt(d, pattern);
}

export function formatReadableDateTime(input, { dayOfWeek = true } = {}) {
  const d = parseDateFlexible(input);
  if (!d) return String(input ?? "");
  const pattern = dayOfWeek ? "EEE, dd MMM yyyy, HH:mm" : "dd MMM yyyy, HH:mm";
  return fmt(d, pattern);
}
