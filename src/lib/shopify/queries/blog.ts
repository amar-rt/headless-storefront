export const BLOG_ARTICLES_QUERY = `
  query BlogArticles($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      id
      title
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          handle
          title
          excerpt
          publishedAt
          image { url altText width height }
          authorV2 { name }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export const ARTICLE_BY_HANDLE_QUERY = `
  query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      title
      articleByHandle(handle: $articleHandle) {
        id
        title
        contentHtml
        publishedAt
        image { url altText width height }
        authorV2 { name }
      }
    }
  }
`;
