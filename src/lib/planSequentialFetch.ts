export const MAX_SEQUENTIAL_PREFETCH = 20;

// Pure planning step, factored out so it's unit-testable without mounting
// React or mocking fetch. Given the highest page number already cached and
// a target page number, returns the ordered list of page numbers that still
// need fetching (in order, since each page's cursor depends on the one
// before it) — capped at maxPrefetch to avoid a pathological cold deep link
// (e.g. ?page=500) triggering hundreds of sequential requests.
export function planSequentialFetch(
  targetPage: number,
  furthestCachedPage: number,
  maxPrefetch: number = MAX_SEQUENTIAL_PREFETCH
): number[] {
  if (targetPage <= furthestCachedPage) return [];
  const pages: number[] = [];
  for (let p = furthestCachedPage + 1; p <= targetPage && pages.length < maxPrefetch; p++) {
    pages.push(p);
  }
  return pages;
}
