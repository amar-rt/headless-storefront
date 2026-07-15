import { formatMoney } from "../lib/money";
import type { MoneyV2 } from "../types/shopify";

export default function Money({ data, className }: { data: MoneyV2 | null | undefined; className?: string }) {
  if (!data) return null;
  return <span className={className}>{formatMoney(data)}</span>;
}
