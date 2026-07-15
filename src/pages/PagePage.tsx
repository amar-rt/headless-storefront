import { useShopifyQuery } from "../lib/useShopifyQuery";
import { PAGE_BY_HANDLE_QUERY } from "../lib/shopify/queries/page";
import RichText from "../components/RichText";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import type { RouteParams } from "../router/Router";
import type { PageContent } from "../types/shopify";

export default function PagePage({ params }: { params: RouteParams }) {
  const { data, loading, error } = useShopifyQuery<{ page: PageContent | null }>(PAGE_BY_HANDLE_QUERY, {
    handle: params.handle,
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  const page = data?.page;
  if (!page) return <ErrorState message="Page not found." />;

  return (
    <div className="page page-generic container">
      <h1>{page.title}</h1>
      <RichText html={page.body} />
    </div>
  );
}
