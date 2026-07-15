import { useCallback, useState } from "react";
import { shopifyFetch, config } from "../lib/shopify/client";
import { COLLECTION_BY_HANDLE_QUERY } from "../lib/shopify/queries/collection";
import { useCursorPagination } from "../lib/useCursorPagination";
import CollectionGrid from "../components/CollectionGrid";
import Pagination from "../components/Pagination";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { Link } from "../router/Router";
import type { RouteParams } from "../router/Router";
import type { ProductCardFields } from "../types/shopify";

interface CollectionByHandleData {
  collection: {
    title: string;
    description: string;
    products: {
      nodes: ProductCardFields[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  } | null;
}

export default function CollectionPage({ params }: { params: RouteParams }) {
  const { handle } = params;
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      const data = await shopifyFetch<CollectionByHandleData>(COLLECTION_BY_HANDLE_QUERY, {
        handle,
        first: config.productsPerPage,
        after: cursor,
      });
      if (!data.collection) throw new Error(`Collection "${handle}" not found.`);
      setMeta({ title: data.collection.title, description: data.collection.description });
      return {
        items: data.collection.products.nodes,
        hasNextPage: data.collection.products.pageInfo.hasNextPage,
        endCursor: data.collection.products.pageInfo.endCursor,
      };
    },
    [handle]
  );

  const { items, pageNumbers, currentPageNumber, hasNextPage, pageOutOfRange, loading, error } =
    useCursorPagination(fetchPage);

  if (error) return <ErrorState message={error} />;

  if (pageOutOfRange) {
    return (
      <div className="page container">
        <p className="empty-state">
          That page doesn't exist. <Link to={`/collections/${handle}`}>Back to page 1</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page page-collection container">
      <h1>{meta?.title || handle.replace(/-/g, " ")}</h1>
      {meta?.description && <p className="lede">{meta.description}</p>}
      {loading && items.length === 0 ? (
        <LoadingState />
      ) : (
        <>
          <CollectionGrid products={items} />
          <Pagination
            pageNumbers={pageNumbers}
            currentPageNumber={currentPageNumber}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  );
}
