// Shopify CDN image URLs accept a `width` query param for on-the-fly
// resizing, so no image-optimization package is needed — just build
// srcset entries at the widths we actually render.
export function shopifyImageUrl(url: string, width: number): string;
export function shopifyImageUrl(url: string | null | undefined, width: number): string | null | undefined;
export function shopifyImageUrl(url: string | null | undefined, width: number): string | null | undefined {
  if (!url) return url;
  const u = new URL(url);
  u.searchParams.set("width", String(width));
  return u.toString();
}

export function shopifyImageSrcSet(
  url: string | null | undefined,
  widths: number[] = [200, 400, 600, 800, 1200]
): string | undefined {
  if (!url) return undefined;
  return widths.map((w) => `${shopifyImageUrl(url, w)} ${w}w`).join(", ");
}
