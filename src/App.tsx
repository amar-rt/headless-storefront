import { isShopifyConfigured } from "./lib/shopify/client";
import { RouterProvider, Routes } from "./router/Router";
import { routes } from "./router/routes";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import NotConfigured from "./components/NotConfigured";

export default function App() {
  // Gate the entire app on configuration before mounting the router, so an
  // unconfigured install never attempts a fetch or shows a blank/error
  // screen — just clear instructions.
  if (!isShopifyConfigured) return <NotConfigured />;

  return (
    <RouterProvider>
      <CartProvider>
        <Layout>
          <Routes routes={routes} />
        </Layout>
      </CartProvider>
    </RouterProvider>
  );
}
