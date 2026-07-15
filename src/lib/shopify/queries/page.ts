export const PAGE_BY_HANDLE_QUERY = `
  query PageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
      bodySummary
      seo { title description }
    }
  }
`;
