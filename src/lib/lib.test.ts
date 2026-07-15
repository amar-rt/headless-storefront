import { test } from "node:test";
import assert from "node:assert/strict";
import { matchPath } from "../router/matchPath.ts";
import { shopifyImageUrl, shopifyImageSrcSet } from "./images.ts";
import { formatMoney } from "./money.ts";
import { planSequentialFetch, MAX_SEQUENTIAL_PREFETCH } from "./planSequentialFetch.ts";

test("matchPath: exact static match", () => {
  assert.deepEqual(matchPath("/collections/all", "/collections/all"), {});
});

test("matchPath: captures a single param", () => {
  assert.deepEqual(matchPath("/products/:handle", "/products/red-shoe"), { handle: "red-shoe" });
});

test("matchPath: captures multiple params", () => {
  assert.deepEqual(matchPath("/blogs/:blogHandle/:articleHandle", "/blogs/news/hello-world"), {
    blogHandle: "news",
    articleHandle: "hello-world",
  });
});

test("matchPath: decodes URI-encoded param segments", () => {
  assert.deepEqual(matchPath("/pages/:handle", "/pages/caf%C3%A9"), { handle: "café" });
});

test("matchPath: returns null on segment-count mismatch", () => {
  assert.equal(matchPath("/products/:handle", "/products/a/b"), null);
});

test("matchPath: returns null on a static segment mismatch", () => {
  assert.equal(matchPath("/collections/:handle", "/products/all"), null);
});

test("matchPath: catch-all matches anything with no params", () => {
  assert.deepEqual(matchPath("*", "/anything/goes/here"), {});
});

test("shopifyImageUrl: appends a width param", () => {
  assert.equal(
    shopifyImageUrl("https://cdn.shopify.com/files/1/img.jpg", 400),
    "https://cdn.shopify.com/files/1/img.jpg?width=400"
  );
});

test("shopifyImageUrl: preserves existing query params", () => {
  assert.equal(
    shopifyImageUrl("https://cdn.shopify.com/files/1/img.jpg?v=123", 400),
    "https://cdn.shopify.com/files/1/img.jpg?v=123&width=400"
  );
});

test("shopifyImageSrcSet: builds a width-descriptor list", () => {
  const srcSet = shopifyImageSrcSet("https://cdn.shopify.com/files/1/img.jpg", [200, 400]);
  assert.equal(
    srcSet,
    "https://cdn.shopify.com/files/1/img.jpg?width=200 200w, https://cdn.shopify.com/files/1/img.jpg?width=400 400w"
  );
});

test("formatMoney: formats USD", () => {
  assert.equal(formatMoney({ amount: "19.99", currencyCode: "USD" }), "$19.99");
});

test("formatMoney: returns empty string for missing data", () => {
  assert.equal(formatMoney({ amount: undefined, currencyCode: "USD" }), "");
});

test("planSequentialFetch: already-cached target needs no fetch", () => {
  assert.deepEqual(planSequentialFetch(2, 3), []);
  assert.deepEqual(planSequentialFetch(3, 3), []);
});

test("planSequentialFetch: advancing one page from a cold start", () => {
  assert.deepEqual(planSequentialFetch(1, 0), [1]);
});

test("planSequentialFetch: cold deep link walks every intermediate page in order", () => {
  assert.deepEqual(planSequentialFetch(4, 0), [1, 2, 3, 4]);
});

test("planSequentialFetch: resumes from the furthest cached page, not from zero", () => {
  assert.deepEqual(planSequentialFetch(5, 2), [3, 4, 5]);
});

test("planSequentialFetch: caps a pathological deep link at maxPrefetch", () => {
  const result = planSequentialFetch(500, 0);
  assert.equal(result.length, MAX_SEQUENTIAL_PREFETCH);
  assert.deepEqual(result, Array.from({ length: MAX_SEQUENTIAL_PREFETCH }, (_, i) => i + 1));
});
