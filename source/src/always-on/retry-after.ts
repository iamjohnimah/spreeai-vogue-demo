/** Wait at least as long as the service requests, with one bounded retry. */
export function tryonRetryDelay(header: string | null, seconds: unknown, attempt: number, now = Date.now()): number | null {
  if (attempt > 0) return null;
  const numericHeader = header?.trim() ? Number(header) : NaN;
  const dateHeader = header && !Number.isFinite(numericHeader) ? Date.parse(header) : NaN;
  const bodySeconds = typeof seconds === 'number' ? seconds : Number(seconds);
  const delay = Number.isFinite(numericHeader) ? numericHeader * 1000
    : Number.isFinite(dateHeader) ? dateHeader - now
    : Number.isFinite(bodySeconds) && bodySeconds > 0 ? bodySeconds * 1000 : 60000;
  // A longer wait needs a fresh user retry; never retry sooner than instructed.
  return delay > 120000 ? null : Math.max(1000, delay);
}
