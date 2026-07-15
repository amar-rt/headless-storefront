import { useCallback, useState } from "react";
import { shopifyFetch, config } from "../lib/shopify/client";
import { BLOG_ARTICLES_QUERY } from "../lib/shopify/queries/blog";
import { useCursorPagination } from "../lib/useCursorPagination";
import Pagination from "../components/Pagination";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { Link } from "../router/Router";
import type { RouteParams } from "../router/Router";
import { shopifyImageUrl } from "../lib/images";
import type { Article } from "../types/shopify";

interface BlogArticlesData {
  blog: {
    title: string;
    articles: {
      nodes: Article[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  } | null;
}

export default function BlogListPage({ params }: { params: RouteParams }) {
  const { blogHandle } = params;
  const [meta, setMeta] = useState<{ title: string } | null>(null);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      const data = await shopifyFetch<BlogArticlesData>(BLOG_ARTICLES_QUERY, {
        handle: blogHandle,
        first: config.articlesPerPage,
        after: cursor,
      });
      if (!data.blog) throw new Error(`Blog "${blogHandle}" not found.`);
      setMeta({ title: data.blog.title });
      return {
        items: data.blog.articles.nodes,
        hasNextPage: data.blog.articles.pageInfo.hasNextPage,
        endCursor: data.blog.articles.pageInfo.endCursor,
      };
    },
    [blogHandle]
  );

  const { items, pageNumbers, currentPageNumber, hasNextPage, pageOutOfRange, loading, error } =
    useCursorPagination(fetchPage);

  if (error) return <ErrorState message={error} />;

  if (pageOutOfRange) {
    return (
      <div className="page container">
        <p className="empty-state">
          That page doesn't exist. <Link to={`/blogs/${blogHandle}`}>Back to page 1</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page page-blog container">
      <h1>{meta?.title || blogHandle}</h1>
      {loading && items.length === 0 ? (
        <LoadingState />
      ) : (
        <>
          <ul className="article-list">
            {items.map((article) => (
              <li key={article.id} className="article-card">
                <Link to={`/blogs/${blogHandle}/${article.handle}`}>
                  {article.image && (
                    <div className="article-card-image">
                      <img
                        src={shopifyImageUrl(article.image.url, 600)}
                        alt={article.image.altText || article.title}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h2>{article.title}</h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
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
