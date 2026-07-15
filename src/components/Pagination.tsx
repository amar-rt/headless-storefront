import { useSearchParams } from "../router/Router";

interface PaginationProps {
  pageNumbers: number[];
  currentPageNumber: number;
  hasNextPage: boolean;
}

// Only ever renders page numbers that have actually been visited/cached —
// future unvisited pages are never shown as clickable, satisfying "disable
// page numbers beyond the furthest page reached."
export default function Pagination({ pageNumbers, currentPageNumber, hasNextPage }: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  if (pageNumbers.length <= 1 && !hasNextPage) return null;

  function goTo(page: number) {
    setSearchParams((params) => {
      if (page <= 1) params.delete("page");
      else params.set("page", String(page));
      return params;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const furthestPage = pageNumbers[pageNumbers.length - 1] || 1;
  // Next is free (cache hit) while there's already a later cached page;
  // once at the furthest known page, it's only allowed if the API said
  // there's more to fetch.
  const nextDisabled = currentPageNumber >= furthestPage && !hasNextPage;

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => goTo(currentPageNumber - 1)}
        disabled={currentPageNumber <= 1}
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className="pagination-btn pagination-number"
          aria-current={page === currentPageNumber ? "page" : undefined}
          onClick={() => goTo(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => goTo(currentPageNumber + 1)}
        disabled={nextDisabled}
      >
        Next
      </button>
    </nav>
  );
}
