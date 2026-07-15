import { useShopifyQuery } from "../lib/useShopifyQuery";
import { ARTICLE_BY_HANDLE_QUERY } from "../lib/shopify/queries/blog";
import RichText from "../components/RichText";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import type { RouteParams } from "../router/Router";
import type { Article } from "../types/shopify";

interface ArticleByHandleData {
  blog: {
    title: string;
    articleByHandle: Article | null;
  } | null;
}

export default function ArticlePage({ params }: { params: RouteParams }) {
  const { data, loading, error } = useShopifyQuery<ArticleByHandleData>(ARTICLE_BY_HANDLE_QUERY, {
    blogHandle: params.blogHandle,
    articleHandle: params.articleHandle,
  });

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  const article = data?.blog?.articleByHandle;
  if (!article) return <ErrorState message="Article not found." />;

  return (
    <article className="page page-article container">
      <h1>{article.title}</h1>
      <p className="article-meta">
        {article.authorV2?.name} · {new Date(article.publishedAt).toLocaleDateString()}
      </p>
      <RichText html={article.contentHtml} className="article-body" />
    </article>
  );
}
