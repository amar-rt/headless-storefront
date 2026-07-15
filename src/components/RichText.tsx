// Renders pre-rendered HTML fields from the Storefront API (product
// descriptions, blog articles, pages). This trusts the merchant's own CMS
// content — the same trust boundary Hydrogen/Liquid themes assume — so no
// sanitizer dependency is pulled in for it.
export default function RichText({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
