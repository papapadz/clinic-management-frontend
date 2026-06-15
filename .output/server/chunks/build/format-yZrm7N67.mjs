globalThis.__timing__.logStart('Load chunks/build/format-yZrm7N67');import { parseISO, format } from 'date-fns';

function formatDate(date, pattern = "MMM dd, yyyy") {
  if (!date) return "\u2014";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern);
  } catch {
    return "\u2014";
  }
}
function formatDateTime(date) {
  return formatDate(date, "MMM dd, yyyy h:mm a");
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2
  }).format(amount != null ? amount : 0);
}
function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num != null ? num : 0);
}
function statusLabel(status) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export { formatDateTime as a, formatNumber as b, formatCurrency as f, statusLabel as s };;globalThis.__timing__.logEnd('Load chunks/build/format-yZrm7N67');
//# sourceMappingURL=format-yZrm7N67.mjs.map
