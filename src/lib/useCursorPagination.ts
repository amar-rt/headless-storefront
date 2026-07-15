import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "../router/Router";
import { planSequentialFetch } from "./planSequentialFetch";

export interface CursorPage<T> {
  items: T[];
  hasNextPage: boolean;
  endCursor?: string;
}

export type FetchPage<T> = (cursor?: string) => Promise<CursorPage<T>>;

interface CursorPaginationResult<T> {
  items: T[];
  pageNumbers: number[];
  currentPageNumber: number;
  hasNextPage: boolean;
  pageOutOfRange: boolean;
  loading: boolean;
  error: string | null;
}

// Numbered pagination on top of Shopify's cursor-based Storefront API.
// `fetchPage(cursor)` must resolve to { items, hasNextPage, endCursor }.
// Its identity isn't tracked as a dependency (read via a ref instead), so
// callers don't need to memoize it with useCallback.
//
// Strategy: cache each page's full result by page number. Revisiting a
// cached page costs nothing. Advancing one page fetches with the previous
// page's endCursor. A cold deep link to an uncached page (e.g. a bookmarked
// ?page=4) walks forward sequentially from the furthest cached page,
// showing `loading` throughout. If the collection ends before reaching the
// requested page, the walk simply stops — `pageOutOfRange` reports that.
export function useCursorPagination<T>(fetchPage: FetchPage<T>): CursorPaginationResult<T> {
  const [searchParams] = useSearchParams();
  const targetPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [pagesById, setPagesById] = useState<Record<number, CursorPage<T>>>({});
  const [furthestPage, setFurthestPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;
  const stateRef = useRef({ pagesById, furthestPage });
  stateRef.current = { pagesById, furthestPage };

  // Guards against a stale walk (e.g. rapid page clicks) writing state after
  // a newer navigation has started a fresher walk.
  const requestIdRef = useRef(0);

  useEffect(() => {
    const { pagesById: cached, furthestPage: furthest } = stateRef.current;
    if (cached[targetPage]) {
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const toFetch = planSequentialFetch(targetPage, furthest);
    setLoading(true);
    setError(null);

    (async () => {
      let cursor = furthest > 0 ? cached[furthest]?.endCursor : undefined;
      const newPages: Record<number, CursorPage<T>> = {};
      let reached = furthest;
      let failure: unknown = null;

      for (const pageNum of toFetch) {
        try {
          const result = await fetchPageRef.current(cursor);
          if (requestIdRef.current !== requestId) return; // superseded
          newPages[pageNum] = result;
          reached = pageNum;
          cursor = result.endCursor;
          if (!result.hasNextPage) break; // collection ended
        } catch (err) {
          failure = err;
          break;
        }
      }

      if (requestIdRef.current !== requestId) return;
      setPagesById((prev) => ({ ...prev, ...newPages }));
      setFurthestPage((prev) => Math.max(prev, reached));
      setError(failure ? (failure as Error).message || String(failure) : null);
      setLoading(false);
    })();
  }, [targetPage]);

  const pageOutOfRange = !loading && !error && targetPage > furthestPage && furthestPage > 0;

  return {
    items: pagesById[targetPage]?.items || [],
    pageNumbers: Object.keys(pagesById).map(Number).sort((a, b) => a - b),
    currentPageNumber: targetPage,
    hasNextPage: Boolean(pagesById[furthestPage]?.hasNextPage),
    pageOutOfRange,
    loading,
    error,
  };
}
