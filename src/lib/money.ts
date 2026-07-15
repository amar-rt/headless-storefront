import type { MoneyV2 } from "../types/shopify";

export function formatMoney({ amount, currencyCode }: Partial<MoneyV2>): string {
  if (amount == null || !currencyCode) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}
