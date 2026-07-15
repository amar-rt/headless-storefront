import { useEffect, useState } from "react";
import { shopifyFetch } from "./shopify/client";

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Simple fetch-on-mount hook for the pages that don't need cursor
// pagination (Home, PDP, article, generic page) — re-fetches whenever the
// query or its variables change.
export function useShopifyQuery<T = unknown>(query: string, variables?: object): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const variablesKey = JSON.stringify(variables);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    shopifyFetch<T>(query, JSON.parse(variablesKey))
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, variablesKey]);

  return { data, loading, error };
}
