export default function NotConfigured() {
  return (
    <div className="not-configured">
      <div className="not-configured-card">
        <h1>Shopify isn't connected yet</h1>
        <p>
          This storefront needs a Shopify store domain and Storefront API token before it can render
          anything. Copy <code>.env.example</code> to <code>.env</code> and fill in:
        </p>
        <pre>{`VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-api-public-token`}</pre>
        <p>
          Generate a token in your Shopify Admin under <strong>Settings → Apps and sales channels → Develop
          apps</strong> — create an app, add Storefront API access with unauthenticated read scopes for
          products, collections, content, and blogs, then restart <code>npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
