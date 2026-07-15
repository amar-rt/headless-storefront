import Home from "../pages/Home";
import CollectionPage from "../pages/CollectionPage";
import ProductPage from "../pages/ProductPage";
import BlogListPage from "../pages/BlogListPage";
import ArticlePage from "../pages/ArticlePage";
import PagePage from "../pages/PagePage";
import NotFound from "../pages/NotFound";
import type { RouteDefinition } from "./Router";

// Order matters only in that the catch-all "*" must be last — matchPath
// requires equal segment counts, so the 3-segment article route and the
// 2-segment blog-list route can never collide with each other.
export const routes: RouteDefinition[] = [
  { path: "/", component: Home },
  { path: "/collections/:handle", component: CollectionPage },
  { path: "/products/:handle", component: ProductPage },
  { path: "/blogs/:blogHandle/:articleHandle", component: ArticlePage },
  { path: "/blogs/:blogHandle", component: BlogListPage },
  { path: "/pages/:handle", component: PagePage },
  { path: "*", component: NotFound },
];
